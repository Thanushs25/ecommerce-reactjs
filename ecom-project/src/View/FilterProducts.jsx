// pages/FilterProducts.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FilterProduct from '../components/filterProduct/FilterProduct';
import FilterNavBar from '../components/navigation/FilterNavBar';
import { fetchFilteredProduct, selectFilteredProducts, selectFilteredLoading, selectFilteredError } from '../redux/product/filterProductSlice';
import { fetchProduct, selectProducts } from '../redux/product/productSlice';
import Footer from '../components/navigation/Footer';

const FilterProducts = () => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
    const { searchQuery } = useParams();
    const [searchQueryState, setSearchQueryState] = useState(searchQuery || '');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [lowPrice, setLowPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const dispatch = useDispatch();

    const filteredProducts = useSelector(selectFilteredProducts);
    const loading = useSelector(selectFilteredLoading);
    const error = useSelector(selectFilteredError);

    const allProducts = useSelector(selectProducts);
    const randomProducts = [...allProducts].sort(() => Math.random() - 0.5); // Randomly shuffle products
    const productsToShow = randomProducts

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(fetchProduct());
        }
    }, [dispatch, allProducts]);

    useEffect(() => {
        if (selectedCategory || selectedSubcategory || lowPrice || maxPrice) {
            dispatch(fetchFilteredProduct({
                category: selectedCategory,
                subcategory: selectedSubcategory,
                lowPrice: lowPrice,
                maxPrice: maxPrice,
            }));
        }
    }, [dispatch, selectedCategory, selectedSubcategory, lowPrice, maxPrice]);

    let productsToDisplay;

    if (selectedCategory || selectedSubcategory || lowPrice || maxPrice) {
        productsToDisplay = filteredProducts;
    } else {
        productsToDisplay = productsToShow;
    }

    if (searchQueryState) {
        productsToDisplay = productsToDisplay.filter((product) =>
            product.name.toLowerCase().includes(searchQueryState.toLowerCase()) ||
            product.desc.toLowerCase().includes(searchQueryState.toLowerCase())
        );
    }

    return (
        <>
            <FilterNavBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubcategory={selectedSubcategory}
                searchQuery={searchQueryState}
                setSearchQuery={setSearchQueryState}
                setSelectedSubcategory={setSelectedSubcategory}
                lowPrice={lowPrice}
                setLowPrice={setLowPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
            />
            {/* Add padding top to account for the fixed navbar */}
            <div style={{ paddingTop: '90px' }}> {/* Adjust this value based on your navbar's actual height */}
                {loading && <p className="text-center">Loading products...</p>}
                {error && <p className="text-center text-danger">Error: {error}</p>}
                {!loading && !error && (
                    <FilterProduct
                        products={productsToDisplay}
                        searchQuery={searchQueryState}
                        setSearchQuery={setSearchQueryState}
                        selectedCategory={selectedCategory}
                        selectedSubcategory={selectedSubcategory}
                        lowPrice={lowPrice}
                        maxPrice={maxPrice}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default FilterProducts;