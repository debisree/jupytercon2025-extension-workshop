import { Widget } from '@lumino/widgets';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { imageIcon } from '@jupyterlab/ui-components';
import { requestAPI } from './request';

type RandomImageResponse = {
  b64_bytes: string;
  caption: string;
};

class ImageCaptionWidget extends Widget {
  private img: HTMLImageElement;
  private captionEl: HTMLParagraphElement;

  constructor() {
    super();

    // Add a friendly greeting
    const hello = document.createElement('p');
    hello.innerHTML = 'Hello, world!';
    this.node.appendChild(hello);

    // Center container
    const center = document.createElement('div');
    center.style.textAlign = 'center';
    this.node.appendChild(center);

    // Image element
    this.img = document.createElement('img');
    this.img.alt = 'Random image';
    this.img.style.maxWidth = '100%';
    center.appendChild(this.img);

    // Caption element
    this.captionEl = document.createElement('p');
    center.appendChild(this.captionEl);

    // Initialize content
    void this.loadImage();
  }

  private async loadImage(): Promise<void> {
    try {
      const data = await requestAPI<RandomImageResponse>('random-image-caption');
      this.img.src = `data:image/jpeg;base64,${data.b64_bytes}`;
      this.captionEl.textContent = data.caption;
    } catch (reason) {
      console.error(`Error fetching image data.\n${reason}`);
    }
  }
}

export class ImageCaptionMainAreaWidget extends MainAreaWidget<ImageCaptionWidget> {
  constructor() {
    const widget = new ImageCaptionWidget();
    super({ content: widget });

    this.title.label = 'Random image with caption';
    this.title.caption = this.title.label;
    this.title.icon = imageIcon;
  }
}