<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Lunar\Facades\CartSession;
use Lunar\Facades\Payments;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\CartAddress;
use Lunar\Models\Country;

class CheckoutController extends Controller
{
    /**
     * Get checkout information
     */
    public function index(Request $request): JsonResponse
    {
        $cart = CartSession::current();

        if (!$cart) {
            return response()->json(['message' => 'No cart found'], 404);
        }

        return response()->json([
            'data' => [
                'cart' => [
                    'id' => $cart->id,
                    'sub_total' => $cart->subTotal->formatted(),
                    'total' => $cart->total->formatted(),
                    'line_count' => $cart->lines->count(),
                ],
                'shipping_address' => $cart->shippingAddress ? $this->formatAddress($cart->shippingAddress) : null,
                'billing_address' => $cart->billingAddress ? $this->formatAddress($cart->billingAddress) : null,
                'shipping_options' => $this->getShippingOptions($cart),
                'countries' => Country::whereIn('iso3', ['GBR', 'USA'])->get()->map(function ($country) {
                    return [
                        'id' => $country->id,
                        'name' => $country->name,
                        'iso3' => $country->iso3,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Set shipping address
     */
    public function setShippingAddress(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'line_one' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postcode' => 'required|string|max:20',
            'country_id' => 'required|exists:countries,id',
            'contact_email' => 'required|email',
            'company_name' => 'nullable|string|max:255',
            'line_two' => 'nullable|string|max:255',
            'line_three' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'delivery_instructions' => 'nullable|string|max:500',
        ]);

        $cart = CartSession::current();

        if (!$cart) {
            return response()->json(['message' => 'No cart found'], 404);
        }

        $address = new CartAddress($request->all());
        $cart->setShippingAddress($address);

        return $this->index($request);
    }

    /**
     * Set billing address
     */
    public function setBillingAddress(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'line_one' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postcode' => 'required|string|max:20',
            'country_id' => 'required|exists:countries,id',
            'contact_email' => 'required|email',
            'company_name' => 'nullable|string|max:255',
            'line_two' => 'nullable|string|max:255',
            'line_three' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'delivery_instructions' => 'nullable|string|max:500',
        ]);

        $cart = CartSession::current();

        if (!$cart) {
            return response()->json(['message' => 'No cart found'], 404);
        }

        $address = new CartAddress($request->all());
        $cart->setBillingAddress($address);

        return $this->index($request);
    }

    /**
     * Set shipping option
     */
    public function setShippingOption(Request $request): JsonResponse
    {
        $request->validate([
            'shipping_option' => 'required|string',
        ]);

        $cart = CartSession::current();

        if (!$cart) {
            return response()->json(['message' => 'No cart found'], 404);
        }

        $options = ShippingManifest::getOptions($cart);
        $option = $options->first(fn ($opt) => $opt->getIdentifier() === $request->shipping_option);

        if (!$option) {
            return response()->json(['message' => 'Invalid shipping option'], 422);
        }

        CartSession::setShippingOption($option);

        return $this->index($request);
    }

    /**
     * Process payment and complete checkout
     */
    public function processPayment(Request $request): JsonResponse
    {
        $request->validate([
            'payment_method' => 'required|in:card,cash-in-hand',
            'payment_intent_client_secret' => 'nullable|string',
            'payment_intent' => 'nullable|string',
        ]);

        $cart = CartSession::current();

        if (!$cart) {
            return response()->json(['message' => 'No cart found'], 404);
        }

        if (!$cart->shippingAddress || !$cart->billingAddress) {
            return response()->json(['message' => 'Missing shipping or billing address'], 422);
        }

        try {
            $paymentData = [];
            
            if ($request->payment_method === 'card') {
                $paymentData = [
                    'payment_intent_client_secret' => $request->payment_intent_client_secret,
                    'payment_intent' => $request->payment_intent,
                ];
            }

            $payment = Payments::driver($request->payment_method)
                ->cart($cart)
                ->withData($paymentData)
                ->authorize();

            if ($payment->success) {
                $order = $cart->completedOrder;
                CartSession::forget();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'data' => [
                        'order_id' => $order->id,
                        'reference' => $order->reference,
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Payment failed',
                'errors' => $payment->errors ?? []
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment processing error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format address for API response
     */
    private function formatAddress(CartAddress $address): array
    {
        return [
            'first_name' => $address->first_name,
            'last_name' => $address->last_name,
            'company_name' => $address->company_name,
            'line_one' => $address->line_one,
            'line_two' => $address->line_two,
            'line_three' => $address->line_three,
            'city' => $address->city,
            'state' => $address->state,
            'postcode' => $address->postcode,
            'country_id' => $address->country_id,
            'contact_email' => $address->contact_email,
            'contact_phone' => $address->contact_phone,
            'delivery_instructions' => $address->delivery_instructions,
        ];
    }

    /**
     * Get shipping options for cart
     */
    private function getShippingOptions($cart): array
    {
        if (!$cart->shippingAddress) {
            return [];
        }

        return ShippingManifest::getOptions($cart)->map(function ($option) {
            return [
                'identifier' => $option->getIdentifier(),
                'name' => $option->getName(),
                'description' => $option->getDescription(),
                'price' => $option->getPrice()->formatted(),
            ];
        })->toArray();
    }
}