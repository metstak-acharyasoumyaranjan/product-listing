'use client';
import { set } from "mongoose";
import { useState , useEffect } from "react";
import { toast } from "sonner";


export default function ProductAddingPage(){
  const initialFormData = {
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

  const [formData , setFormData] = useState(initialFormData)
  const [brands , setBrands] = useState([])
  const [tag , setTag] = useState("")
  const [fetchedCategory, setFetchedCategory] = useState([])
  const [category , setCategory] = useState("")
  const [variant , setVariant] = useState({
    label : "",
    value : ""
  })
  const [specification , setSpecification] = useState({
    name : "" ,
    value : ""
  })
  const [variantLabel , setVariantLabel] = useState("")
  const [ variantValue, setVariantValue] = useState("")



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
    const updatedTags = [...formData.tags , tag]
    setFormData({...formData , tags : updatedTags})
    setTag("")
  }

  function handleCategorySubmit(){
    const updatedCategories = [...formData.categories , category]
    setFormData({...formData , categories : updatedCategories})
    setCategory("")
  }

  function handleSpecificationSubmit(){
    const updatedSpecification = [...formData.specification , specification]
    setFormData({...formData , specification:updatedSpecification})
    setSpecification({
      name : "" ,
      value : ""
    })
  }
  

  async function handleSubmit(event : React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    console.log("Submitting:", formData);
    const response = await fetch("http://localhost:3000/api/products" , {
      method : "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body : JSON.stringify(formData)
    })

    if (!response.ok){
      const error = await response.json();

      console.log("Status:", response.status);
      console.dir(error, { depth: null });

      toast.error("Could Not Create Product")
      return;
    }

    toast.success("Product Created")
    setFormData(initialFormData)
    getCategories()
    getBrands()
  }

  return(
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm p-4">
      <label>Product Name</label>
      <input type="text" value={formData.product_name} onChange={(e)=>setFormData({...formData , product_name:e.target.value})} className="border p-2 w-full rounded " />
      <label>Brand</label>
      <select name="brand" value={formData.brand} onChange={(e)=>setFormData({...formData , brand:e.target.value})}>
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
        {formData.categories.map((cat , index)=>(
          <h2 key={index}>{cat}</h2>
        ))}
      </div>
      <label>
      <input
          type="checkbox"
          checked = {formData.isActive}
          onChange={(e)=> setFormData({...formData , isActive : e.target.checked})}
       />Active
       </label>
      <div>
        <label>Tags</label>
        <input type="text" value={tag} onChange={(e)=>setTag(e.target.value)}/>
        <button type = "button" onClick={handleTagSubmit}>add tags</button>
        <div>
          <h1 key="category">Added Tags are</h1>
          {formData.tags.map((tag ,index)=>(
            <h2 key={index}>{tag}</h2>
          ))}
        </div>
       </div>
       <label>Price Range</label>
       <label>Minimum Price</label>
       <input type="text" value={formData.price_range.minimum_price} onChange={(e)=>setFormData({...formData , price_range:{...formData.price_range , minimum_price : Number(e.target.value)}})}/>
       <label>Maximum Price</label>
       <input type="text" value={formData.price_range.maximum_price} onChange={(e)=>setFormData({...formData , price_range :{...formData.price_range , maximum_price: Number(e.target.value)}})}/>
       <label>
        <input type="checkbox" checked={formData.enable_variants} onChange={(e)=>setFormData({...formData , enable_variants:e.target.checked})}/>
        Enable Variants
       </label>
       {
       formData.enable_variants &&
       <div className="flex flex-col gap-4 max-w-sm p-4">
       <label>Variant Label</label>
       <input type="text" value={variantLabel} onChange={(e)=>setVariantLabel(e.target.value)}/>
       <label>Variant Value</label>
       <input type="text" value={variantValue} onChange={(e)=>setVariantValue(e.target.value)}/>
       </div>
       }
       <h1>Specification</h1>
       <label>Specificatin Name</label>
       <input type="text" value={specification.name} onChange={(e)=>setSpecification({...specification , name:e.target.value})}/>
       <label>Specificatin Value</label>
       <input type="text" value={specification.value} onChange={(e)=>setSpecification({...specification , value:e.target.value})}/>
       <button type="button" onClick={handleSpecificationSubmit}>Add Specification</button>
       <div>
        <h1>Added Specifications are</h1>
        {formData.specification.map((spec , index)=>(
          <div key={index}>
          <h2>Spec Name: {spec.name}</h2>
          <h2>Spec Value: {spec.value}</h2>
          </div>
        ))}
       </div>
       <button type='submit'>Add Product</button>
    </form>
  )
}

