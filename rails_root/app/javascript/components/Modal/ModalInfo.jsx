/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { convertFromRaw, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const ModalInfo = (props) => {
  const { isOpen, modalTitle, toggle, desc, logo, categories } = props;

  const close = () => toggle();
  const closeBtn = (
    <button className="close close-button-click" onClick={close}>
      &times;
    </button>
  );

  const x = desc;

  const RenderHTML = (props) => (
    <div
      className="col-12"
      dangerouslySetInnerHTML={{ __html: props.HTML }}
    ></div>
  );

  const Categories = (props) => {
    const categories_span = () => {
      return categories.map((category, num) => {
        return (
          <span key={num} className="сurrency-box сurrency-box__category">
            <span className="card-lave-currency-text">{category}</span>
          </span>
        );
      });
    };

    if (categories) {
      return <p>{categories_span()}</p>;
    } else {
      return <span></span>;
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className="my-modal-info">
        <ModalHeader
          className="align-items-center modal-header-login"
          close={closeBtn}
          toggle={toggle}
        >
          {modalTitle}
        </ModalHeader>

        <ModalBody>
          <div className="row">
            <div className="col-12 mt-1">
              <div className="row no-gutters justify-content-center">
                <div className="col-6 text-center">
                  <img
                    alt="..."
                    className="img-no-padding img-responsive"
                    src={logo}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 mt-3">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-6">
                  <p className="gray-modal-offers-text">Описание</p>
                </div>
              </div>
            </div>

            <div className="col-12 mt-2">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-6">
                  <Categories {...props} />
                </div>
              </div>
            </div>

            <div className="col-12 mt">
              <div className="row no-gutters align-items-center justify-content-between">
                {x && <RenderHTML HTML={draftToHtml(JSON.parse(x))} />}
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalInfo;
