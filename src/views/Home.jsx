import React, { Component } from 'react';
import axios from 'axios';

import WrapperStation from '../components/WrapperStation';
import Header from '../components/Header';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: {},
      loading: true,
      currentAddress: {},
      arrivalAddress: {},
      bikesIsChecked: true,
      standsIsChecked: true,
      bankingIsChecked: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.setCurrentAdress = this.setCurrentAdress.bind(this);
    this.setArrivalAddress = this.setArrivalAddress.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /** Fonctions pour mettre a jour l'adresse actuel et
   * la deuxième l'address d'arriver
   * on recurperes ses coordonners:
   * - id
   * - address
   * - geographique
   */

  setCurrentAdress(currAddress) {
    this.setState({ currentAddress: currAddress });
  }

  setArrivalAddress(arrAddress) {
    this.setState({ arrivalAddress: arrAddress });
  }

  fetchData() {
    axios
      .get('https://data.nantesmetropole.fr/api/records/1.0/search/', {
        params: {
          dataset:
            '244400404_stations-velos-libre-service-nantes-metropole-disponibilites',
          rows: 200,
          facet: 'status',
          'refine.status': 'OPEN',
        },

        headers: {
          Authorization: process.env.REACT_APP_NANTES_DATA_API_KEY,
        },
      })
      .then(({ data }) => {
        const stations = data.records.map((record) => {
          return {
            id: record.recordid,
            address: record.fields.address,
            name: record.fields.name,
            availableBikes: record.fields.available_bikes,
            availableBikeStand: record.fields.available_bike_stands,
            banking: record.fields.banking,
            position: record.fields.position,
          };
        });
        this.setState({ stations, loading: false });
      })
      .catch((err) => alert(err.message));
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.checked });
  }

  render() {
    const {
      loading,
      stations,
      bikesIsChecked,
      standsIsChecked,
      bankingIsChecked,
      currentAddress,
      arrivalAddress,
    } = this.state;
    return (
      <div className="App">
        <Header
          setCurrentAdress={this.setCurrentAdress}
          handleChange={this.handleChange}
          bikesIsChecked={bikesIsChecked}
          standsIsChecked={standsIsChecked}
          bankingIsChecked={bankingIsChecked}
          setArrivalAddress={this.setArrivalAddress}
        />
        {!loading && (
          <>
            <WrapperStation
              stations={stations}
              bikesIsChecked={bikesIsChecked}
              standsIsChecked={standsIsChecked}
              bankingIsChecked={bankingIsChecked}
              currentAddress={currentAddress.coordinates}
              arrivalAddress={arrivalAddress.coordinates}
            />
          </>
        )}
      </div>
    );
  }
}

export default Home;
