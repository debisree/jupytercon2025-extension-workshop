import { Widget } from '@lumino/widgets';
import { MainAreaWidget, ToolbarButton } from '@jupyterlab/apputils';
import { imageIcon, refreshIcon } from '@jupyterlab/ui-components';
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

    const hello = document.createElement('p');
    hello.innerHTML = 'Hello, world!';
    this.node.appendChild(hello);

    const center = document.createElement('div');
    center.style.textAlign = 'center';
    this.node.appendChild(center);

    this.img = document.createElement('img');
    this.img.alt = 'Random image';
    this.img.style.maxWidth = '100%';
    center.appendChild(this.img);

    this.captionEl = document.createElement('p');
    center.appendChild(this.captionEl);

    void this.loadImage();
  }

  // Make this public and keep camelCase
  async loadImage(): Promise<void> {
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

    const refreshButton = new ToolbarButton({
      icon: refreshIcon,
      tooltip: 'Refresh image',
      onClick: () => {
        void widget.loadImage(); // call the public method with correct name
      }
    });
    this.toolbar.addItem('refresh', refreshButton);
  }
}