import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./assets/style.css";
import * as bootstrap from "bootstrap";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://ec-course-api.hexschool.io/v2";
const API_PATH = import.meta.env.VITE_API_PATH || "atien_week2";

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);

  //表單輸入處理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, // 保留原有屬性
      [name]: value, // 更新特定屬性
    }));
  };

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTemplateProduct((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTemplateProduct((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;
      return {
        ...prevData,
        imagesUrl: newImages,
      };
    });
  };

  const handleAddImage = () => {
    setTemplateProduct((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""], // 增加一個空字串供輸入
    }));
  };

  const handleRemoveImage = () => {
    setTemplateProduct((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop(); // 移除最後一項
      return { ...prevData, imagesUrl: newImages };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      //登入成功後的處理
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;

      // 設定 Axios 全域 Header (後續請求就不用重複寫)
      axios.defaults.headers.common.Authorization = token;

      getProducts();
      setIsAuth(true);
      alert("登入成功");
    } catch (error) {
      setIsAuth(false);
      console.log(error.response?.data);
      alert(error.response?.data?.message + "，請檢查帳號密碼");
    }
  };

  //取得產品資料
  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("取得產品失敗：", error.response?.data?.message);
    }
  };

  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...templateProduct,
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imagesUrl: templateProduct.imagesUrl
          ? templateProduct.imagesUrl.filter((url) => url !== "")
          : [],
      },
    };
    try {
      const response = await axios[method](url, productData);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  // 刪除產品
  const deleteProductData = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      console.log("產品刪除成功：", response.data);
      alert("產品刪除成功！");

      // 關閉 Modal 並重新載入資料
      closeModal();
      getProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error("刪除失敗：", errorMsg);
      alert("刪除失敗：" + errorMsg);
      getProducts();
    }
  };

  //新增圖片
  const uploadImage = async (e,type,index) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );

      const uploadedUrl = response.data.imageUrl

      if (type === "main") {
        setTemplateProduct((pre) => ({
          ...pre,
          imageUrl: uploadedUrl,
        }));
      } else {
        handleModalImageChange(index, uploadedUrl);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    //檢查登入狀態
    const checkLogin = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        //console.log("Token 驗證結果：", response.data);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        setIsAuth(false);
        console.log(error.response?.data.message);
      }
    };
    checkLogin();
  }, []);

  const openModal = (product, type) => {
    setTemplateProduct((prevData) => ({
      ...prevData,
      ...product,
      imagesUrl: product.imagesUrl ? [...product.imagesUrl] : [],
    }));
    //console.log(product);
    //設定modal類型
    //console.log(type);
    setModalType(type);
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };
  return (
    <>
      {!isAuth ? (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h1 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form
                id="form"
                className="form-signin"
                onSubmit={(e) => onSubmit(e)}
              >
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2025~∞ - 六角學院</p>
        </div>
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          <div className="row mt-5">
            <div className="text-end mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openModal(INITIAL_TEMPLATE_DATA, "create")}
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>分類</th>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className={`${product.is_enabled && "text-success"}`}>
                      {product.is_enabled ? "啟用" : "未啟用"}
                    </td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openModal(product, "edit")}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            openModal(product, "delete");
                          }}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      )}
      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        handleAddImage={handleAddImage}
        handleModalImageChange={handleModalImageChange}
        handleModalInputChange={handleModalInputChange}
        handleRemoveImage={handleRemoveImage}
        updateProduct={updateProduct}
        deleteProductData={deleteProductData}
        uploadImage={uploadImage}
        closeModal={closeModal}
        productModalRef={productModalRef}
      />
    </>
  );
}

export default App;
