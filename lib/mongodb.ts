import { Product } from "@/model/Product"
import mongoose from "mongoose"
import { Category } from "@/model/Category";
import { Brand } from "@/model/Brands";
import { Manufacturer } from "@/model/Manufacturer";
import { CategoryInput , ManufacturerInput , BrandInput } from "@/schema/db_validation";

export async function connectDB() {
    console.log("Connecting...");

    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected");
    } catch (err) {
        console.error("Connect failed:", err);
        throw err;
    }
}
// CATEGORY ACTIONS
export async function getAllCategories(){
    const category = await Category.find()
    return category
}
export async function createCategory(item : CategoryInput){
    const newCategory = await Category.create(item)
    return newCategory
}
export async function getCategoryById(id : string){
    const category = await Category.findById(id)
    return category
}
export async function updateCategoryById(id : string , data : Partial<CategoryInput>){
    const updatedCategory = await Category.findByIdAndUpdate(id , data , {new: true, runValidators: true,})
    return updatedCategory
}
export async function deleteCategoryById(id: string){
    return Category.findByIdAndDelete(id)
}




// MANUFACTURER ACTIONS
export async function getAllManufacturers(){
    const manufacturers = await Manufacturer.find()
    return manufacturers
}
export async function createManufacturer(item : ManufacturerInput){
    const newManufacturer = await Manufacturer.create(item)
    return newManufacturer
}
export async function getManufacturerById(id : string){
    const manufacturer = await Manufacturer.findById(id)
    return manufacturer
}
export async function updateManufacturerById(id : string , data : Partial<ManufacturerInput>){
    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(id , data , {new: true, runValidators: true,})
    return updatedManufacturer
}
export async function deleteManufacturerById(id: string){
    return Manufacturer.findByIdAndDelete(id)
}



// BRAND ACTIONS
export async function getAllBrands(){
    const brands = await Brand.find().populate("manufacturer")
    return brands
}
export async function createBrand(item : BrandInput){
    const newBrand = await Brand.create(item)
    return newBrand
}
export async function getBrandById(id : string){
    const brand = await Brand.findById(id).populate("manufacturer")
    return brand
}
export async function updateBrandById(id : string , data : Partial<BrandInput>){
    const updatedBrand = await Brand.findByIdAndUpdate(id , data , {new: true, runValidators: true,})
    return updatedBrand
}
export async function deleteBrandById(id: string){
    return Brand.findByIdAndDelete(id)
}






export async function getAllProducts() {
  return await Product.find()
    .populate({
      path: "brand",
      populate: {
        path: "manufacturer",
      },
    })
    .populate("categories");
}
export async function CreateProduct(item : Object){
    console.log("Item:", item);
    console.log("Type:", typeof item);
    return await Product.create(item);
}

export async function getProductById(id: string) {
  return await Product.findById(id)
    .populate({
      path: "brand",
      populate: {
        path: "manufacturer",
      },
    })
    .populate("categories");
}


export async function updateProductById(id: string , data : Object){
    return Product.findByIdAndUpdate(id , data , {new: true, runValidators: true,})
}

export async function deleteProductById(id: string){
    return Product.findByIdAndDelete(id)
}
