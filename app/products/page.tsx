import Image from "next/image";



export default async function ProductPage(){
  const response = await fetch("http://localhost:3000/api/products")
  const products = await response.json()
  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {products.map((product, index) => (
      <div
        key={index}
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
      >
        <div className="relative h-56 w-full bg-gray-100">
          {product.gallery?.[0]?.url && (
            <Image
              src={product.gallery[0].url}
              alt={product.product_name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="p-5 space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {product.product_name}
          </h2>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.categories[0]?.name}
            </p>

            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {product.brand.brand_name}
            </p>

            <p>
              <span className="font-semibold">Manufacturer:</span>{" "}
              {product.brand.manufacturer.manufacturer_name}
            </p>

            <p>
              <span className="font-semibold">Price:</span>{" "}
              ₹{product.price_range.minimum_price} - ₹
              {product.price_range.maximum_price}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}