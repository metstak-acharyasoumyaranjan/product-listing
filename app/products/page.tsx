
export default async function ProductPage(){
  const response = await fetch("http://localhost:3000/api/products")
  const products = await response.json()
  return(
    <div className="mx-4 gap-4">
      {products.map((product , index)=>(
        <div key={index} className="max-w-sm p-6 mt-4 bg-black border border-gray-200 rounded-xl shadow-sm">
        <h1 className="mt-4 text-3xl font-bold border-b-4 border-blue-500 pb-2 inline-block">product Name is :{product.product_name}</h1>
        <h2>product category is :{product.categories[0].name}</h2>
        <h3>product brand is :{product.brand.brand_name}</h3>
        <h4>product manufacturer is :{product.brand.manufacturer.manufacturer_name}</h4>
        <h5>product price ranges from :{product.price_range.minimum_price} - {product.price_range.maximum_price} {product.price_range.currency}</h5>
        </div>
      ))}
    </div>
  )
}