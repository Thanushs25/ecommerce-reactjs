import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, FormControl, Form } from 'react-bootstrap';
import './FilterNavBar.css'; // Import the dedicated CSS file

const FilterNavBar = ({
    setSearchQuery, searchQuery,
    selectedCategory, setSelectedCategory,
    selectedSubcategory, setSelectedSubcategory,
    maxPrice, setMaxPrice,
    lowPrice, setLowPrice
}) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category || '');
        setSelectedSubcategory('');
    };

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory || '');
    };

    const handlePriceRangeChange = (range) => {
        if (range) {
            const [low, high] = range.split('-').map(Number);
            setLowPrice(low);
            setMaxPrice(high);
        } else {
            setLowPrice('');
            setMaxPrice('');
        }
    };

    return (
        <Navbar
            variant="light"
            expand="lg"
            fixed="top"
            className={`py-4 custom-navbar ${scrolled ? 'scrolled-navbar' : ''}`}
        >
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="fw-bold fs-15 custom-brand-logo"
                >
                    <span className="brand-text-uc">UC</span>
                    <span className="brand-text-name">Urban Cart</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarNav" />
                <Navbar.Collapse id="navbarNav">
                    <Nav className="ms-auto me-3 align-items-lg-center">
                        <Form
                            className="d-flex ms-lg-3 mt-3 mt-lg-0"
                        >
                            <FormControl
                                type="search"
                                placeholder="Search products..."
                                className="me-2 rounded-pill border custom-search-input"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form>
                        <Nav.Link as={Link} to="/" className="mx-2 nav-link-custom">
                            Home
                        </Nav.Link>

                        {/* Category Dropdown */}
                        <NavDropdown
                            title={selectedCategory ? `Category: ${selectedCategory}` : "Category"}
                            id="category-dropdown"
                            onSelect={handleCategoryChange}
                            className="mx-2 nav-dropdown-custom"
                        >
                            <NavDropdown.Item eventKey="">All Categories</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item eventKey="Electronics">Electronics</NavDropdown.Item>
                            <NavDropdown.Item eventKey="Cloths">Cloths</NavDropdown.Item>
                            <NavDropdown.Item eventKey="Footwear">Footwear</NavDropdown.Item>
                        </NavDropdown>

                        {/* Subcategory Dropdown (conditionally rendered) */}
                        {selectedCategory && (
                            <NavDropdown
                                title={selectedSubcategory ? `Subcategory: ${selectedSubcategory}` : "Subcategory"}
                                id="subcategory-dropdown"
                                className="mx-2 nav-dropdown-custom"
                                onSelect={handleSubcategoryChange}
                            >
                                <NavDropdown.Item eventKey="">All Subcategories</NavDropdown.Item>
                                <NavDropdown.Divider />
                                {selectedCategory === "Electronics" && (
                                    <>
                                        <NavDropdown.Item eventKey="Laptops">Laptops</NavDropdown.Item>
                                        <NavDropdown.Item eventKey="Mobiles">Mobiles</NavDropdown.Item>
                                    </>
                                )}
                                {selectedCategory === "Cloths" && (
                                    <>
                                        <NavDropdown.Item eventKey="Men">Men's</NavDropdown.Item>
                                        <NavDropdown.Item eventKey="Women">Women's</NavDropdown.Item>
                                        <NavDropdown.Item eventKey="Kids">Kid's</NavDropdown.Item>
                                    </>
                                )}
                                {selectedCategory === "Footwear" && (
                                    <>
                                        <NavDropdown.Item eventKey="Men">Men's</NavDropdown.Item>
                                        <NavDropdown.Item eventKey="Women">Women's</NavDropdown.Item>
                                        <NavDropdown.Item eventKey="Kids">Kid's</NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>
                        )}

                        {/* Price Range Dropdown (conditionally rendered) */}
                        {selectedCategory && (
                            <NavDropdown
                                title={lowPrice && maxPrice ? `₹${lowPrice} - ₹${maxPrice}` : "Price Range"}
                                id="price-range-dropdown"
                                className="mx-2 nav-dropdown-custom"
                                onSelect={handlePriceRangeChange}
                            >
                                <NavDropdown.Item eventKey="">All Prices</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="100-1000">₹100 - ₹1000</NavDropdown.Item>
                                <NavDropdown.Item eventKey="1001-5000">₹1001 - ₹5000</NavDropdown.Item>
                                <NavDropdown.Item eventKey="5001-20000">₹5001 - ₹20000</NavDropdown.Item>
                                <NavDropdown.Item eventKey="20001-50000">₹20001 - ₹50000</NavDropdown.Item>
                                <NavDropdown.Item eventKey="50001-100000">₹50001 - ₹100000</NavDropdown.Item>
                                <NavDropdown.Item eventKey="100001-100000000">₹100001 - Above</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default FilterNavBar;