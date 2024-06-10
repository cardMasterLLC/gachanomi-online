import pica from "pica";

/**
 * 画像をリサイズする関数
 * @param {File} imageFile - リサイズする画像ファイル
 * @param {number} maxWidth - 最大幅（必須）
 * @returns {Promise<Blob>} リサイズされた画像のBlob（PNG形式）
 */
export async function resizeImage(imageFile, maxWidth) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = async () => {
      // 縦横比を保持して新しいサイズを計算
      const aspectRatio = img.height / img.width;
      const newWidth = maxWidth;
      const newHeight = maxWidth * aspectRatio;

      // キャンバスを作成して画像を描画
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      // 透過背景を保持するために、キャンバスの背景を設定しない

      try {
        // picaを使用してリサイズ
        await pica().resize(img, canvas);
        const blob = await pica().toBlob(canvas, "image/png"); // PNG形式で保存
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Image loading error"));
    };
  });
}
