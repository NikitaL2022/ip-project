// dependencies / things imported
import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';
import '@lrnwebcomponents/wikipedia-query/wikipedia-query.js';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    // api doesn't work. requires api key, but still doesn't work
    this.long = null;
    this.lat = null;
    this.city = null;
    this.state = null;
  }

  static get properties() {
    return {
      long: { type: Number },
      lat: { type: Number },
      city: { type: String },
      state: { type: String },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  async getGEOIPData() {
    // hardcoded values because api is failing to retreive values for this address
    this.city = 'State College';
    // no article in wikipedia query for just city
    this.state = 'Pennsylvania';
    this.long = -77.859909;
    this.lat = 40.798214;

    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return (
      fetch(this.locationEndpoint + userIPData.ip)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }
          return false;
        })
        // api doesn't work so data above fails and hardcoded used instead
        .then(data => {
          console.log(data);
          this.long = data.longitude;
          this.lat = data.latitude;
          this.city = data.city;
          this.state = data.region_name;
          return data;
        })
    );
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return html`<iframe title="Where you are" src="${url}"></iframe>

      <br />
      <input @input=${this.changeLat} .value="${this.lat}" />
      <input @input=${this.changeLong} .value="${this.long}" />
      <button @click=${this.resetCoordinates}>Reset</button>
      <link href="https://www.google.com/maps/@${this.lat},${this.long},14z" />
      <wikipedia-query search="${this.city}, ${this.state}"></wikipedia-query>
      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.state}"></wikipedia-query> `;
  }

  resetCoordinates() {
    this.getGEOIPData();
  }

  changeLat(event) {
    const input = event.target;
    this.lat = input.value;
  }

  changeLong(event) {
    const input = event.target;
    this.long = input.value;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
