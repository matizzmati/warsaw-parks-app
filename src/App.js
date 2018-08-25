import React, { Component } from 'react'
import './App.css'
import { locations } from './locations'
import SideBar from './SideBar'


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: locations,
            map: '',
            infowindow: ''
        }
        this.initMap = this.initMap.bind(this)
        this.openInfoWindow = this.openInfoWindow.bind(this)
    }


    componentDidMount() {
        window.initMap = this.initMap
        this.injectMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBUXT3iJCVG3MU2CBLB0NNR9WWrWufhwno&callback=initMap")
    }


    injectMapScript(src) {
        const script = window.document.createElement("script")
        const ref = window.document.getElementsByTagName("script")[0]
        script.src = src
        script.async = true
        script.onerror = function () {
            document.write("Google Maps can't be loaded")
        };
        ref.parentNode.insertBefore(script, ref)
    }
    

    initMap = () => {
        const mapSelector = document.getElementById('map');
        const googleMapObj = window.google.maps
        const config = {
            center: {lat: 52.2298, lng: 21.0014},
            zoom: 12
        }
        const map = new googleMapObj.Map(mapSelector, config)
        const infowindow = new googleMapObj.InfoWindow({})
        
        this.setState({
            map: map,
            infowindow: infowindow
        })

        const markers = []
        this.state.locations.forEach(location => {
            const name = location.name
            const marker = new googleMapObj.Marker({
                position: new googleMapObj.LatLng(location.latitude, location.longitude),
                animation: googleMapObj.Animation.DROP,
                map: map,
                fsid: location.fsid
            })

            location.name = name
            location.marker = marker
            location.display = true
            markers.push(location)
            
            marker.addListener('click', () => {
                this.openInfoWindow(marker)
            })
        })

        this.setState({
            locations: markers
        })
    }


    openInfoWindow = (marker) => {
        this.state.infowindow.open(this.state.map, marker)
        this.state.infowindow.setContent('Loading Data...')
        this.state.map.setCenter(marker.getPosition())
        this.state.map.panBy(0, -100)
        this.fetchDetails(marker)
    }


    fetchDetails = (marker) => {
        const clientId = 'DTQIKEOXA5UFOITJ0ZWVYNA4K0GM5PO22LHR4ETLSYLI2TV5'
        const clientSecret = 'FNLWADNOY3WS0BSNZBI50ZQYO13XBQQGPNDZAPBGMVE2T013'
        const url = 'https://api.foursquare.com/v2/venues/' + marker.fsid + '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20180323&limit=1'
        fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    this.state.infowindow.setContent("Data can't be loaded")
                    return
                }
                response.json()
                .then(data => {
                    this.setInfowindowContent(data)
                })
            }).catch(err => {
                this.state.infowindow.setContent("Data can't be loaded")
        })
    }


    setInfowindowContent = (data) => {
        const details = data.response.venue;
                    const content =
                    '<div class="infoWindow">'
                        + '<div class="title">' + details.name + '</div>'
                        + '<div class="likes">' + details.likes.summary + '</div>'
                        + '<div class="rating" style=background-color:#' + details.ratingColor + ';>Rating: ' + details.rating + '</div>'
                        + '<img src="' + details.bestPhoto.prefix + '200x200' + details.bestPhoto.suffix + '" alt="' + data.response.venue.name + '"></img>'
                        + '<div class="address">Address:<br>' + details.location.address + ' ' + details.location.city + '</div>'
                    + '</div>'

        this.state.infowindow.setContent(content)
    }
    

    render() {
        return (         
            <div>
                <SideBar
                    locations = {this.state.locations}
                    openInfoWindow = {this.openInfoWindow}
                    infowindow = {this.state.infowindow}
                    map = {this.state.map}
                />
                <div id="map"></div>
            </div>
        )
    }
}

export default App
