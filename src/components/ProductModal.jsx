import * as bootstrap from "bootstrap";
function ProductModal({
  modalType,
  templateProduct,
  handleAddImage,
  handleModalImageChange,
  handleModalInputChange,
  handleRemoveImage,
  updateProduct,
  deleteProductData,
  uploadImage,
  closeModal,
  productModalRef,
}) {
  return (
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref={productModalRef}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header bg-${
              modalType === "delete" ? "danger" : "dark"
            } text-white`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === "delete"
                  ? "刪除"
                  : modalType === "create"
                    ? "新增產品"
                    : "編輯產品"}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          {modalType === "delete" ? (
            <div className="modal-body">
              <p className="fs-4">
                確定要刪除
                <span className="text-danger">{templateProduct.title}</span>嗎？
              </p>
            </div>
          ) : (
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="mainFile" className="form-label">
                        上傳主圖
                      </label>
                      <input
                        type="file"
                        id="mainFile"
                        className="form-control"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => uploadImage(e, "main")} // 傳入 main 類型
                      />
                      {templateProduct.imageUrl && (
                        <img
                          className="img-fluid mt-2"
                          src={templateProduct.imageUrl}
                          alt="主圖"
                        />
                      )}
                    </div>
                    <div className="mb-2">
                      {templateProduct.imagesUrl?.map((url, index) => (
                        <div key={index} className="mb-3 border p-2">
                          <label
                            htmlFor={`file-sub-${index}`}
                            className="form-label"
                          >
                            副圖 {index + 1}
                          </label>
                          <input
                            type="file"
                            id={`file-sub-${index}`}
                            className="form-control"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => uploadImage(e, "sub", index)} // 傳入 sub 與索引
                          />
                          {url && (
                            <img
                              className="img-fluid mt-2 border"
                              src={url}
                              alt={`預覽 ${index + 1}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* {templateProduct.imagesUrl.map((url, index) => (
                      <div key={index} className="mb-3">
                        <label htmlFor="fileupload" className="form-label">
                          上傳圖片
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          name="fileupload"
                          id="fileupload"
                          accept=".jpg, .jpeg .png"
                          onChange={(e)=> uploadImage(e)}
                        />
                        <input
                          id={`imageUrl${index}`}
                          type="text"
                          className="form-control"
                          placeholder={`圖片網址${index + 1}`}
                          value={url}
                          onChange={(e) =>
                            handleModalImageChange(index, e.target.value)
                          }
                        />
                        {url && (
                          <img className="img-fluid" src={url} alt="主圖" />
                        )}
                      </div>
                    ))} */}
                  </div>
                  <div>
                    {templateProduct.imagesUrl?.length < 5 &&
                      (templateProduct.imagesUrl.length === 0 ||
                        templateProduct.imagesUrl[
                          templateProduct.imagesUrl.length - 1
                        ]) && (
                        <button
                          className="btn btn-outline-primary btn-sm d-block w-100"
                          onClick={handleAddImage}
                        >
                          新增圖片欄位
                        </button>
                      )}
                    {templateProduct.imagesUrl?.length >= 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm d-block w-100 mt-2"
                        onClick={handleRemoveImage}
                      >
                        刪除最後一張圖片
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templateProduct.title || ""}
                      onChange={(e) => handleModalInputChange(e)}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        id="category"
                        name="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={templateProduct.category || ""}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        id="unit"
                        name="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={templateProduct.unit}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        name="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templateProduct.origin_price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templateProduct.price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templateProduct.description}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={templateProduct.content}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        name="is_enabled"
                        type="checkbox"
                        className="form-check-input"
                        checked={templateProduct.is_enabled}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={() => {
                closeModal();
              }}
            >
              取消
            </button>
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteProductData(templateProduct.id)}
              >
                確認刪除
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => updateProduct(templateProduct.id)}
              >
                確認
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
