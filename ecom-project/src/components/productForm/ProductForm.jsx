// src/components/productForm/ProductForm.jsx
import React, { useState } from 'react';
import axiosConfig from '../../api/axiosConfig';
import './ProductForm.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const [requestData, setRequestData] = useState({
    name: "",
    desc: "",
    imageUrl: "",
    categoryId: null,
    subCategoryId: null,
    createdAdminId: 1,
    productVariants: [
      {
        price: 0,
        stock: 0,
        attributes: {},
      }
    ]
  });

  const subCategoryOptions = {
    Electronics: [
      { value: 1, label: "Laptop" },
      { value: 2, label: "Mobile" },
    ],
    Cloths: [
      { value: 3, label: "Men" },
      { value: 4, label: "Women" },
      { value: 5, label: "Kids" },
    ],
    Footwear: [
      { value: 6, label: "Men" },
      { value: 7, label: "Women" },
      { value: 8, label: "Kids" },
    ],
  };

  const categoryIds = {
    Electronics: 1,
    Cloths: 2,
    Footwear: 3,
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    console.log("Selected Category:", selectedCategory);
    console.log("Category ID:", categoryIds[selectedCategory]);
    setSubCategories(subCategoryOptions[selectedCategory] || []);

    setRequestData(prevData => ({
      ...prevData,
      categoryId: categoryIds[selectedCategory] || null,
      subCategoryId: null,
      productVariants: prevData.productVariants.map(variant => ({
        ...variant,
        attributes: {}
      }))
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setRequestData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleProductVariantChange = (index, e) => {
    const { id, value } = e.target;
    const updatedVariants = requestData.productVariants.map((variant, i) => {
      if (i === index) {
        if (id === "price") {
          return { ...variant, price: parseFloat(value) || 0 };
        } else if (id === "stock") {
          return { ...variant, stock: parseInt(value) || 0 };
        }
      }
      return variant;
    });
    setRequestData(prevData => ({
      ...prevData,
      productVariants: updatedVariants,
    }));
  };

  const handleAttributeChange = (index, e) => {
    const { id, value } = e.target;
    const updatedVariants = requestData.productVariants.map((variant, i) => {
      if (i === index) {
        return {
          ...variant,
          attributes: {
            ...variant.attributes,
            [id]: value,
          }
        };
      }
      return variant;
    });
    setRequestData(prevData => ({
      ...prevData,
      productVariants: updatedVariants,
    }));
  };

  const addProductVariant = () => {
    setRequestData(prevData => ({
      ...prevData,
      productVariants: [
        ...prevData.productVariants,
        { price: 0, stock: 0, attributes: {} }
      ]
    }));
  };

  const removeProductVariant = (index) => {
    setRequestData(prevData => ({
      ...prevData,
      productVariants: prevData.productVariants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", requestData);
    const jsonPayload = JSON.stringify(requestData);
    try {
      const response = await axiosConfig.post("admin/manage/addProduct", jsonPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        // alert("Product added successfully!");
        toast.success("Product added successfully!");
        window.scrollTo(0, 0); 
        setRequestData({
          name: "",
          desc: "",
          imageUrl: "",
          createdAdminId: 1,
          categoryId: null,
          subCategoryId: null,
          productVariants: [
            {
              price: 0,
              stock: 0,
              attributes: {},
            }
          ]
        });
        setCategory(""); // Reset category as well for a clean form
        setSubCategories([]); // Reset subcategories
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.log("Error response:", error.response.data);
      alert("An error occurred while adding the product. Please check the console for details."); // More informative error
    }
  };

  return (
    // Removed bg-light from here if you want the global body background to show through,
    // or you could add a custom class here and style it in CSS if you want this container to have a specific background.
    <div className="container-fluid py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-xl-12 col-lg-10 col-md-11 col-sm-12">
      <h2 className="text-center mb-4 product-form-title">Add New Product</h2>
        <form className="p-5 border border-light rounded-4 shadow-lg product-add-form" onSubmit={handleSubmitForm}>
          <div className="row g-4">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold text-muted">Product Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="name"
                placeholder="Enter product name"
                value={requestData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="imageUrl" className="form-label fw-semibold text-muted">Image Source URL</label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="imageUrl"
                placeholder="e.g., https://example.com/image.jpg"
                value={requestData.imageUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="desc" className="form-label fw-semibold text-muted">Product Description</label>
              <textarea
                className="form-control form-control-lg"
                id="desc"
                rows="3"
                placeholder="Description of the product"
                value={requestData.desc}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="col-md-6">
              <label htmlFor="productCategory" className="form-label fw-semibold text-muted">Category</label>
              <select
                id="productCategory"
                className="form-select form-select-lg"
                value={category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Cloths">Cloths</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            {category && (
              <div className="col-md-6">
                <label htmlFor="subCategoryId" className="form-label fw-semibold text-muted">Subcategory</label>
                <select
                  id="subCategoryId"
                  className="form-select form-select-lg"
                  value={requestData.subCategoryId || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.value} value={subCategory.value}>
                      {subCategory.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <hr className="my-5 border-2 border-secondary" />
            <h3 className="mb-4 text-center text-secondary fw-bold">Product Variants</h3>

            {requestData.productVariants.map((variant, index) => (
              // Changed bg-light to custom class 'product-variant-section'
              <div key={index} className="border p-4 mb-4 rounded-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 text-dark">Variant {index + 1}</h5>
                  {requestData.productVariants.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeProductVariant(index)}
                    >
                      Remove Variant
                    </button>
                  )}
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor={`price-${index}`} className="form-label text-muted">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      placeholder="e.g., 99.99"
                      value={variant.price}
                      onChange={(e) => handleProductVariantChange(index, e)}
                      required
                      min="1"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`stock-${index}`} className="form-label text-muted">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="stock"
                      placeholder="e.g., 100"
                      value={variant.stock}
                      onChange={(e) => handleProductVariantChange(index, e)}
                      required
                      min="0"
                    />
                  </div>

                  {category.toLowerCase() === "electronics" ? (
                    <>
                      <div className="col-md-6">
                        <label htmlFor={`brand-${index}`} className="form-label text-muted">Brand</label>
                        <input
                          type="text"
                          className="form-control"
                          id="brand"
                          placeholder="e.g., Sony, Samsung"
                          value={variant.attributes.brand || ""}
                          onChange={(e) => handleAttributeChange(index, e)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor={`ram-${index}`} className="form-label text-muted">RAM</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ram"
                          placeholder="e.g., 8GB, 16GB"
                          value={variant.attributes.ram || ""}
                          onChange={(e) => handleAttributeChange(index, e)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor={`storage-${index}`} className="form-label text-muted">Storage</label>
                        <input
                          type="text"
                          className="form-control"
                          id="storage"
                          placeholder="e.g., 256GB SSD, 1TB HDD"
                          value={variant.attributes.storage || ""}
                          onChange={(e) => handleAttributeChange(index, e)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor={`processor-${index}`} className="form-label text-muted">Processor</label>
                        <input
                          type="text"
                          className="form-control"
                          id="processor"
                          placeholder="e.g., Intel i7, Apple M1"
                          value={variant.attributes.processor || ""}
                          onChange={(e) => handleAttributeChange(index, e)}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    category && (
                      <>
                        <div className="col-md-4">
                          <label htmlFor={`brand-${index}`} className="form-label text-muted">Brand</label>
                          <input
                            type="text"
                            className="form-control"
                            id="brand"
                            placeholder="e.g., Nike, Zara"
                            value={variant.attributes.brand || ""}
                            onChange={(e) => handleAttributeChange(index, e)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor={`size-${index}`} className="form-label text-muted">Size</label>
                          <input
                            type="text"
                            className="form-control"
                            id="size"
                            placeholder="e.g., S, M, L, XL or 7, 8, 9"
                            value={variant.attributes.size || ""}
                            onChange={(e) => handleAttributeChange(index, e)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor={`colour-${index}`} className="form-label text-muted">Colour</label>
                          <input
                            type="text"
                            className="form-control"
                            id="colour"
                            placeholder="e.g., Red, Blue, Black"
                            value={variant.attributes.colour || ""}
                            onChange={(e) => handleAttributeChange(index, e)}
                            required
                          />
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            ))}

            <div className="col-12 text-center mt-3">
              <button type="button" className="btn btn-outline-secondary btn-lg px-4 btn-update" onClick={addProductVariant}>
                Add Another Variant
              </button>
            </div>

            <div className="col-12 mt-1 text-center">
              <button type="submit" className="btn btn-outline-secondary btn-lg px-4 btn-update">Add Product</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;