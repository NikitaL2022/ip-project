import { LitElement, css, html } from "lit";
import '@lrnwebcomponents/accent-card/accent-card.js';

class NasaDates extends LitElement {
    constructor() {
      super();
      this.images = [];
      this.description = [];
      this.title = [];
    }

    static get properties() {
      return {
        view: { type: String, reflect: true },
        dates: {
          type: Array,
        },
        loadData: {
          type: Boolean,
          reflect: true,
          attribute: 'load-data',
        },
      };
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === 'loadData' && this[propName]) {
          this.getData();
        }
        // when dates changes, fire an event for others to react to if they wish
        else if (propName === 'images') {
          this.dispatchEvent(
            new CustomEvent('results-changed', {
              detail: {
                value: this.images,
              },
            })
          );
        }
      });
    }
    async getNASAData() {
      fetch(this.term)
         .then(response =>{
           if (resp.ok) {
           // but remote requests should check for a valid response
           response.json();
         }
       
       return false;
         })
         .then(data => {
           console.log(data);
           this.images = [];
           for (let i = 0; i < data.length; i++) {
             const eventInfo = {
               image: href[i].image,
               description: data[i].description,
               title: data[i].title,
             };
           }
         });
     }
    render() {
      return html`
        ${this.view === 'list'
          ? html`
              <ul>
                ${this.dates.map(
                  item => html`
                    <li>
                      ${item.images} - ${item.description} - ${item.title}
                    </li>
                  `
                )}
              </ul>
            `
          : html`
              ${this.images.map(
                item => html`
                  <accent-card image-src="https://images-api.nasa.gov/search?q=moon%20landing&media_type=image">
                    <div slot="heading">item.description</div>
                    <div slot="content">item.title</div>
                  ></accent-card>
                `
              )}
            `}
      `;
    }

}

customElements.define('nasa-image-search', NasaDates);