import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    productCode: "",
    barcode: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    taxRate: 0,
    stock: "",
    minimumStock: 5,
    unit: "piece",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createProduct({
        ...form,
        purchasePrice: Number(form.purchasePrice),
        sellingPrice: Number(form.sellingPrice),
        taxRate: Number(form.taxRate),
        stock: Number(form.stock),
        minimumStock: Number(form.minimumStock),
      });

      if (data.success) {
        alert("Product created successfully");

        setShowForm(false);

        setForm({
          name: "",
          productCode: "",
          barcode: "",
          category: "",
          purchasePrice: "",
          sellingPrice: "",
          taxRate: 0,
          stock: "",
          minimumStock: 5,
          unit: "piece",
        });

        loadProducts();
      }
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteProduct(id);

      if (data.success) {
        alert("Product deleted");

        loadProducts();
      }
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div
          style={{
            padding: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <h1>Products</h1>

              <p
                className="product-form"
                style={{
                  color: "#6b7280",
                }}
              >
                Manage your store products
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "12px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              + Add Product
            </button>
          </div>

          {showForm && (
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "10px",
                marginBottom: "25px",
              }}
            >
              <h2>Add Product</h2>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15px",
                }}
              >
                <input
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  name="productCode"
                  placeholder="Product Code"
                  value={form.productCode}
                  onChange={handleChange}
                  required
                />

                <input
                  name="barcode"
                  placeholder="Barcode"
                  value={form.barcode}
                  onChange={handleChange}
                />

                <input
                  name="category"
                  placeholder="Category ID"
                  value={form.category}
                  onChange={handleChange}
                  required
                />

                <input
                  name="purchasePrice"
                  type="number"
                  placeholder="Purchase Price"
                  value={form.purchasePrice}
                  onChange={handleChange}
                  required
                />

                <input
                  name="sellingPrice"
                  type="number"
                  placeholder="Selling Price"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  required
                />

                <input
                  name="taxRate"
                  type="number"
                  placeholder="Tax Rate %"
                  value={form.taxRate}
                  onChange={handleChange}
                />

                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />

                <input
                  name="minimumStock"
                  type="number"
                  placeholder="Minimum Stock"
                  value={form.minimumStock}
                  onChange={handleChange}
                />

                <select name="unit" value={form.unit} onChange={handleChange}>
                  <option value="piece">Piece</option>

                  <option value="kg">Kg</option>

                  <option value="gram">Gram</option>

                  <option value="liter">Liter</option>

                  <option value="meter">Meter</option>

                  <option value="box">Box</option>

                  <option value="bag">Bag</option>
                </select>

                <button
                  type="submit"
                  style={{
                    padding: "12px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Save Product
                </button>
              </form>
            </div>
          )}

          {error && (
            <div
              style={{
                color: "red",
                background: "white",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: "white",
              borderRadius: "10px",
              overflow: "auto",
            }}
          >
            {loading ? (
              <p
                style={{
                  padding: "25px",
                }}
              >
                Loading products...
              </p>
            ) : products.length === 0 ? (
              <p
                style={{
                  padding: "25px",
                }}
              >
                No products found.
              </p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f9fafb",
                    }}
                  >
                    <th>Product</th>
                    <th>Code</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Tax</th>
                    <th>Unit</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>

                      <td>{product.productCode}</td>

                      <td>₹{product.sellingPrice}</td>

                      <td>{product.stock}</td>

                      <td>{product.taxRate}%</td>

                      <td>{product.unit}</td>

                      <td>
                        <button
                          onClick={() => handleDelete(product._id)}
                          style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "7px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Products;
