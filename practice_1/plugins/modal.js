function _createModal(options) {
  const { title, closable, content, width = "400px" } = options || {};

  const modal = document.createElement("div");

  modal.style.width = width;

  modal.classList.add("vmodal");

  modal.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="modal-overlay">
        <div class="modal-window">
          <div class="modal-header">
            <span class="modal-title">${title}</span>
            ${closable ? `<span class="modal-close">&times;</span>` : ""}
          </div>
          <div class="modal-body">
          ${content || ""}
          </div>
          <div class="modal-footer">
            <button>OK</button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    `
  );

  document.body.appendChild(modal);

  return modal;
}

/**
 * title: string
 * closable: boolean
 * content: string
 * width: string ('400px')
 * destroy(): void (removed modal and listeners)
 * ------------
 * action for close window
 * public setContent(html: string): void
 * onClose(): void
 * onOpen(): void
 * beforeClose(): boolean | if true then you can close else you can't
 * ------------
 * animate.css
 */

$.modal = function(options) {
  const { onOpen, onClose, beforeClose } = options;
  const ANIMATION_SPEED = 200;
  const $modal = _createModal(options);

  let closing = false;
  let isDestroy = false;

  const closeButton = $modal.getElementsByClassName("modal-close")[0];

  const result = {
    open() {
      if (closing) {
        return;
      }
      $modal.classList.add("open");
      onOpen && onOpen();
    },
    close() {
      beforeClose && beforeClose(closing);
      if (closing) {
        return;
      }
      closing = true;
      $modal.classList.remove("open");
      $modal.classList.add("hide");
      setTimeout(() => {
        $modal.classList.remove("hide");
        closing = false;
        onClose && onClose();
      }, ANIMATION_SPEED);
    },
    //memory leaks
    destroy() {
      if (isDestroy) {
        return;
      }
      document.body.removeChild($modal);
    },
    setContent(html) {
      const body = $modal.getElementsByClassName("modal-body")[0];
      body.innerHTML = html;
    }
  };

  if (closeButton) {
    closeButton.addEventListener("click", result.close);
  }

  return result;
};
