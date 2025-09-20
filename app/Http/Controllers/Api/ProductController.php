<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Lunar\Models\Collection;
use Lunar\Models\Url;

class ProductController extends Controller
{
    /**
     * Get all products with pagination
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $products = Product::with(['media', 'variants.basePrices.currency'])
            ->paginate($perPage);

        return response()->json([
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * Get single product by slug
     */
    public function show(string $slug): JsonResponse
    {
        $url = Url::whereElementType(Product::class)
            ->whereSlug($slug)
            ->with([
                'element.media',
                'element.variants.basePrices.currency',
                'element.variants.basePrices.priceable',
                'element.variants.values.option',
            ])
            ->first();

        if (!$url) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product = $url->element;

        return response()->json([
            'data' => [
                'id' => $product->id,
                'name' => $product->translateAttribute('name'),
                'description' => $product->translateAttribute('description'),
                'slug' => $url->slug,
                'images' => $product->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->getUrl(),
                        'alt' => $media->name,
                    ];
                }),
                'variants' => $product->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'stock' => $variant->stock,
                        'price' => $variant->basePrices->first()?->price?->value ?? 0,
                        'formatted_price' => $variant->basePrices->first()?->price?->formatted ?? '$0.00',
                        'options' => $variant->values->map(function ($value) {
                            return [
                                'option' => $value->option->translate('name'),
                                'value' => $value->translate('name'),
                            ];
                        }),
                    ];
                }),
            ]
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        $perPage = $request->get('per_page', 15);

        if (!$query) {
            return response()->json(['data' => [], 'pagination' => null]);
        }

        $products = Product::where('attribute_data->name->en', 'LIKE', "%{$query}%")
            ->orWhere('attribute_data->description->en', 'LIKE', "%{$query}%")
            ->with(['media', 'variants.basePrices.currency'])
            ->paginate($perPage);

        return response()->json([
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * Get products by collection
     */
    public function collection(string $slug): JsonResponse
    {
        $url = Url::whereElementType(Collection::class)
            ->whereSlug($slug)
            ->with(['element.products.media', 'element.products.variants.basePrices.currency'])
            ->first();

        if (!$url) {
            return response()->json(['message' => 'Collection not found'], 404);
        }

        $collection = $url->element;

        return response()->json([
            'data' => [
                'collection' => [
                    'id' => $collection->id,
                    'name' => $collection->translateAttribute('name'),
                    'slug' => $url->slug,
                ],
                'products' => $collection->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->translateAttribute('name'),
                        'slug' => $product->urls->first()?->slug,
                        'thumbnail' => $product->thumbnail?->getUrl(),
                        'price' => $product->variants->first()?->basePrices->first()?->price?->formatted ?? '$0.00',
                    ];
                }),
            ]
        ]);
    }
}