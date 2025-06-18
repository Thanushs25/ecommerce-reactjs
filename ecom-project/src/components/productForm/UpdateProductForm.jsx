import React, { useState, useEffect } from 'react';
import axiosConfig from '../../api/axiosConfig';
import './UpdateProductForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const patchProduct = async (product, productId, adminId) => {
    try {
        const response = await axiosConfig.patch(`/admin/manage/updateProduct/${productId}/admin/${adminId}`, product);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error updating product:', error.response?.data || error.message);
    }
};

const UpdateProductForm = ({ prevProduct, productId, adminId }) => {
    const subCategoryOptions = {
        Electronics: [
            { value: 1, label: "Laptops" },
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

    console.log(prevProduct.product)

    const [category, setCategory] = useState(prevProduct.product.category || '');
    const [subCategories, setSubCategories] = useState([]);
    const [requestData, setRequestData] = useState({
        name: prevProduct.product.name || '',
        desc: prevProduct.product.desc || '',
        imageUrl: prevProduct.product.imageUrl || '',
        categoryId: categoryIds[prevProduct.product.category] || '',
        subCategoryId: subCategoryOptions[prevProduct.product.category]?.filter(subCat => subCat.label === prevProduct.product.subCategory)[0]?.value || '',
        productVariants: prevProduct.product.productVariants || [
            {
                productVariantId: 0,
                price: 0,
                stock: 0,
                attributes: {},
            },
        ],
    });
    console.log('Initial Request Data:', requestData);

    useEffect(() => {
        if (category) {
            setSubCategories(subCategoryOptions[category] || []);
        }
    }, [category]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setRequestData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        console.log(selectedCategory);
        setSubCategories(subCategoryOptions[selectedCategory] || []);
        console.log(categoryIds[selectedCategory]);
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

    const handleProductVariantChange = (index, e) => {
        const { id, value } = e.target;
        setRequestData((prevData) => {
            const updatedVariants = [...prevData.productVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [id]: id === 'stock' || id === 'price' ? Number(value) : value,
            };
            return {
                ...prevData,
                productVariants: updatedVariants,
            };
        });
    };

    const handleAttributeChange = (index, e) => {
        const { id, value } = e.target;
        setRequestData((prevData) => {
            const updatedVariants = [...prevData.productVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                attributes: {
                    ...updatedVariants[index].attributes,
                    [id]: value,
                },
            };
            return {
                ...prevData,
                productVariants: updatedVariants,
            };
        });
    };

    const addProductVariant = () => {
        setRequestData((prevData) => ({
            ...prevData,
            productVariants: [
                ...prevData.productVariants,
                {
                    productVariantId: prevData.productVariants.length + 1,
                    price: 0,
                    stock: 0,
                    attributes: {},
                },
            ],
        }));
    };

    const removeProductVariant = (index) => {
        setRequestData((prevData) => ({
            ...prevData,
            productVariants: prevData.productVariants.filter((_, i) => i !== index),
        }));
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const sanitizedProductVariants = requestData.productVariants.map(({ stockStatus, ...rest }) => ({
                ...rest,
                stock: Number(rest.stock),
                price: Number(rest.price),
            }));

            const sanitizedRequestData = {
                ...requestData,
                productVariants: sanitizedProductVariants,
            };

            console.log('Sanitized Request Data:', sanitizedRequestData);

            const updatedProduct = await patchProduct(sanitizedRequestData, productId, adminId);
            console.log('Updated Product:', updatedProduct);
            toast.success('Product updated successfully!');
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    };

    return (
        <div className="container-fluid py-5 min-vh-100 d-flex align-items-center justify-content-center">
            <div className="col-lg-12 col-md-10 col-sm-12">
                <h2 className="mb-5 text-center fw-bold product-form-title">Update Product</h2>
                <form className="p-5 border border-light-subtle rounded-4 shadow-lg product-update-form" onSubmit={handleSubmitForm}>
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
                                placeholder="Provide a detailed description of the product"
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

                        <hr className="my-5 border-2 border-secondary-subtle" />
                        <h3 className="mb-4 text-center text-secondary fw-bold">Product Variants</h3>

                        {requestData.productVariants.map((variant, index) => (
                            <div key={index} className="border p-4 mb-4 rounded-3 bg-light shadow-sm">
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
                                        <label htmlFor={`price-${index}`} className="form-label">Price ($)</label>
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
                                        <label htmlFor={`stock-${index}`} className="form-label">Stock Quantity</label>
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
                                                <label htmlFor={`brand-${index}`} className="form-label">Brand</label>
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
                                                <label htmlFor={`ram-${index}`} className="form-label">RAM</label>
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
                                                <label htmlFor={`storage-${index}`} className="form-label">Storage</label>
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
                                                <label htmlFor={`processor-${index}`} className="form-label">Processor</label>
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
                                                    <label htmlFor={`brand-${index}`} className="form-label">Brand</label>
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
                                                    <label htmlFor={`size-${index}`} className="form-label">Size</label>
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
                                                    <label htmlFor={`colour-${index}`} className="form-label">Colour</label>
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
                            <button type="button" className="btn btn-outline-secondary btn-lg px-4 product-form-title" onClick={addProductVariant}>
                                Add Another Variant
                            </button>
                        </div>
                        <div className="col-12 mt-1 text-center">
                            <button type="submit" className="btn btn-outline-secondary btn-lg px-4 btn-update ">Update Product</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductForm;