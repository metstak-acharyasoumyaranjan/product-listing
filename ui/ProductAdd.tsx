'use client';


import { useState , useEffect } from "react";
import { toast } from "sonner";
import { logOutSession } from "@/lib/utils/actions/user.action";


export default function ProductAddingPage(){
  const initialproductData = {
    product_name: "",

    brand: "",

    categories: [],

    price_range: {
      minimum_price: 0,
      maximum_price: 0,
      currency: "INR",
    },

    enable_variants: false,

    variant_attributes: [],

    gallery: [],

    specification: [],

    tags: [],

    isActive: true,

    isFeatured: false,
  };

  const [productData , setproductData] = useState(initialproductData)
  const [brands , setBrands] = useState([])
  const [tag , setTag] = useState("")
  const [fetchedCategory, setFetchedCategory] = useState([])
  const [category , setCategory] = useState("")
  const [variantAttribute , setVariantAttribute] = useState({
    name : "",
    unit : "",
    values : []
  })
  const [variant , setVariant] = useState({
    label:"",
    value:""
  })
  const [specification , setSpecification] = useState({
    name : "" ,
    value : ""
  })
  const [imageUrl , setImageUrl] = useState({
    url : ""
  })
  const [image , setImage] = useState<File | null>(null)
  useEffect(()=>{
    getBrands()
    getCategories()
  }, [])
  async function getBrands() {
    const response = await fetch("http://localhost:3000/api/brands")
    const data = await response.json()
    console.log("brands",data)
    setBrands(data)
  }

  async function getCategories(){
    const response = await fetch("http://localhost:3000/api/categories")
    const data = await response.json()
    console.log("categories",data)
    setFetchedCategory(data)
  }

  function handleTagSubmit(){
    const updatedTags = [...productData.tags , tag]
    setproductData({...productData , tags : updatedTags})
    setTag("")
  }

  function handleCategorySubmit(){
    const updatedCategories = [...productData.categories , category]
    setproductData({...productData , categories : updatedCategories})
    setCategory("")
  }

  function handleSpecificationSubmit(){
    const updatedSpecification = [...productData.specification , specification]
    setproductData({...productData , specification:updatedSpecification})
    setSpecification({
      name : "" ,
      value : ""
    })
  }

  function handleVariantAttributeSubmission(){
    const updatedVariantAttribute = [...productData.variant_attributes , variantAttribute]
    setproductData({...productData , variant_attributes : updatedVariantAttribute})
    setVariantAttribute({
      name : "",
      unit : "",
      values : []
    })
  }

  // function handleImageSubmission(){
  //   const updatedGallery = [...productData.gallery , imageUrl]
  //   setproductData({...productData , gallery:updatedGallery})
  //   setImageUrl({
  //     url : ""
  //   })
  // }

  function handleVariantSubmission(){
    const updatedVariant = [...variantAttribute.values , variant]
    setVariantAttribute({...variantAttribute , values:updatedVariant})
    setVariant({
      label:"",
      value:""
    })
  }
  
  async function handleImageUpload(){
    if (!image) return;
    const imageData = new FormData();
    imageData.append("image" , image)
    const res = await fetch("/api/media",{
      method: "POST",
      body : imageData,
    });

    const data = await res.json();
    const url = data.path
    console.log(url)
    // setImageUrl({...imageUrl , url:url})
    // console.log(imageUrl)
    const updatedGallery = [...productData.gallery , { url }]
    console.log(updatedGallery)
    setproductData({...productData , gallery:updatedGallery})
    setImage(null)
    setImageUrl({
      url : ""
    })
  }

  function logOut(){
    logOutSession()
  }

  async function handleSubmit(event : React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    console.log("Submitting:", productData);
    const response = await fetch("http://localhost:3000/api/products" , {
      method : "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body : JSON.stringify(productData)
    })

    if (!response.ok){
      const error = await response.json();

      console.log("Status:", response.status);
      console.log("Error:", error);

      toast.error("Could Not Create Product")
      return;
    }

    toast.success("Product Created")
    setproductData(initialproductData)
    getCategories()
    getBrands()
  }

  return(
    <div>
    <div>
      <button onClick={logOut}>Log Out</button>
    </div>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm p-4">
      <label>Product Name</label>
      <input type="text" value={productData.product_name} onChange={(e)=>setproductData({...productData , product_name:e.target.value})} className="border p-2 w-full rounded " />
      <label>Brand</label>
      <select name="brand" value={productData.brand} onChange={(e)=>setproductData({...productData , brand:e.target.value})}>
        <option key="empty brand" value="">Select Brand</option>
        {brands.map((brand)=>(
          <option key={brand._id} value={brand._id}>{brand.brand_name}</option>
        ))}
      </select>
      <label>Category</label>
      <select name="category" value={category} onChange={(e)=>setCategory(e.target.value)}>
        <option key="empty cat" value="">Select Category</option>
        {fetchedCategory.map((category)=>(
          <option key={category._id} value={category._id}>{category.name}</option>
        ))}
      </select>
      <button type="button" onClick={handleCategorySubmit}>add category</button>
      <div>
        <h1>Added Categories Are</h1>
        {productData.categories.map((cat , index)=>(
          <h2 key={index}>{cat}</h2>
        ))}
      </div>
      <label>
      <input
          type="checkbox"
          checked = {productData.isActive}
          onChange={(e)=> setproductData({...productData , isActive : e.target.checked})}
       />Active
       </label>
      <div>
        <label>Tags</label>
        <input type="text" value={tag} onChange={(e)=>setTag(e.target.value)}/>
        <button type = "button" onClick={handleTagSubmit}>add tags</button>
        <div>
          <h1 key="category">Added Tags are</h1>
          {productData.tags.map((tag ,index)=>(
            <h2 key={index}>{tag}</h2>
          ))}
        </div>
       </div>
       <label>Price Range</label>
       <label>Minimum Price</label>
       <input type="text" value={productData.price_range.minimum_price} onChange={(e)=>setproductData({...productData , price_range:{...productData.price_range , minimum_price : Number(e.target.value)}})}/>
       <label>Maximum Price</label>
       <input type="text" value={productData.price_range.maximum_price} onChange={(e)=>setproductData({...productData , price_range :{...productData.price_range , maximum_price: Number(e.target.value)}})}/>
       <label>
        <input type="checkbox" checked={productData.enable_variants} onChange={(e)=>setproductData({...productData , enable_variants:e.target.checked})}/>
        Enable Variants
       </label>
       {
       productData.enable_variants &&
       <div className="flex flex-col gap-4 max-w-sm p-4">
       <label>Attribute Name</label>
       <input type="text" value={variantAttribute.name} onChange={(e)=>setVariantAttribute({...variantAttribute , name:e.target.value})}/>
       <label>Attribute Unit</label>
       <input type="text" value={variantAttribute.unit} onChange={(e)=>setVariantAttribute({...variantAttribute , unit:e.target.value})}/>
       <label>Variant Label</label>
       <input type="text" value={variant.label} onChange={(e)=>setVariant({...variant , label:e.target.value})}/>
       <label>Variant Value</label>
       <input type="text" value={variant.value} onChange={(e)=>setVariant({...variant , value:e.target.value})}/>
       <button type="button" onClick={handleVariantSubmission}>Add Attribute Label & Value</button>
       <button type="button" onClick={handleVariantAttributeSubmission}>Add Varriant Attribute</button>
       </div>
       }
       <h1>Specification</h1>
       <label>Specification Name</label>
       <input type="text" value={specification.name} onChange={(e)=>setSpecification({...specification , name:e.target.value})}/>
       <label>Specification Value</label>
       <input type="text" value={specification.value} onChange={(e)=>setSpecification({...specification , value:e.target.value})}/>
       <button type="button" onClick={handleSpecificationSubmit}>Add Specification</button>
       <div>
        <h1>Added Specifications are</h1>
        {productData.specification.map((spec , index)=>(
          <div key={index}>
          <h2>Spec Name: {spec.name}</h2>
          <h2>Spec Value: {spec.value}</h2>
          </div>
        ))}
       </div>
       {/* <div>
        <label className="flex flex-col gap-4 max-w-sm p-4">Upload Images</label>
        <input type="text" value={imageUrl.url} onChange={(e)=>setImageUrl({...imageUrl , url: e.target.value})}/>
        <button type="button" onClick={handleImageSubmission }>Add Image</button>
       </div> */}
       <div>
        <label>Add Images</label>
        <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0] || null)}/>
        <button type="button" onClick={handleImageUpload}>Add Image</button>
       </div>
       <button type='submit'>Add Product</button>
    </form>
    </div>
  )
}

