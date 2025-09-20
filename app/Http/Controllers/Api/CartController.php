<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Lunar\Facades\CartSession;
use Lunar\Models\ProductVariant;

class CartController extends Controller
{
    /**
     * Get current cart
     */
    public function index(Request $request): JsonResponse
    {
        $cart = CartSession::current();

        if (!$cart) {
            return response()->json([
                'data' => [
                    'lines' => [],
                    'sub_total' => '$0.00',
                    'total' => '$0.00',
                    'line_count' => 0,
                ]
            ]);
        }

        return response()->json([
            'data' => [
                'id' => $cart->id,
                'lines' => $cart->lines->map(function ($line) {
                    return [
                        'id' => $line->id,
                        'quantity' => $line->quantity,
                        'product' => [
                            'id' => $line->purchasable->product->id,
                            'name' => $line->purchasable->getDescription(),
                            'slug' => $line->purchasable->product->urls->first()?->slug,
                            'thumbnail' => $line->purchasable->getThumbnail()?->getUrl(),
                            'options' => $line->purchasable->getOptions()->implode(' / '),
                        ],
                        'variant' => [
                            'id' => $line->purchasable->id,
                            'sku' => $line->purchasable->sku,
                        ],
                        'unit_price' => $line->unitPrice->formatted(),
                        'sub_total' => $line->subTotal->formatted(),
                    ];
                }),
                'sub_total' => $cart->subTotal->formatted(),
                'total' => $cart->total->formatted(),
                'line_count' => $cart->lines->count(),
            ]
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $variant = ProductVariant::findOrFail($request->variant_id);

        // Check stock
        if ($variant->stock < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock available',
                'errors' => ['quantity' => ['The quantity exceeds available stock']]
            ], 422);
        }

        CartSession::manager()->add($variant, $request->quantity);

        return $this->index($request);
    }

    /**
     * Update cart line quantity
     */
    public function update(Request $request, $lineId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $cart = CartSession::current();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $line = $cart->lines->where('id', $lineId)->first();
        
        if (!$line) {
            return response()->json(['message' => 'Cart line not found'], 404);
        }

        // Check stock
        if ($line->purchasable->stock < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock available',
                'errors' => ['quantity' => ['The quantity exceeds available stock']]
            ], 422);
        }

        CartSession::updateLines(collect([
            [
                'id' => $lineId,
                'quantity' => $request->quantity,
            ]
        ]));

        return $this->index($request);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, $lineId): JsonResponse
    {
        CartSession::remove($lineId);

        return $this->index($request);
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = CartSession::current();
        
        if ($cart) {
            foreach ($cart->lines as $line) {
                CartSession::remove($line->id);
            }
        }

        return $this->index($request);
    }
}