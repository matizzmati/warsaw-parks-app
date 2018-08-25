import React from 'react'

class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            locations: '',
            query: ''
        };
        this.filter = this.filter.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
    }


    componentWillMount() {
        this.setState({
            locations: this.props.locations
        })
    }


    filter(event) {
        this.props.infowindow.close()
        const locations = []
        this.props.locations.forEach(location => {
            if (location.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
                location.marker.setVisible(true)
                locations.push(location)
            } else {
                location.marker.setVisible(false)
            }
        })

        this.setState({
            locations: locations,
            query: event.target.value
        })
    }


    handleMouseOver(marker) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        this.props.map.panTo(marker.getPosition())
        setTimeout(() => {marker.setAnimation(null)}, 500 )
    }

    
    toggleMenu() {
        const sidebar = document.querySelector('.sideBar')
        if (sidebar.style.transform !== '') {
            sidebar.style.transform = ''
        } else {
            sidebar.style.transform = 'translate(-100%, 0)'
        }
        
    }


    render() {
        return (
            <div>
                <div className="sideBar">
                    <div className="searchBar">
                        <input 
                            role="search"
                            aria-labelledby="filter"
                            id="search-field"
                            className="search-field"
                            type="text"
                            placeholder="Filter parks"
                            value={this.state.query} 
                            onChange={this.filter}
                        />
                    </div>
                    <ul role="navigation">
                        {this.state.locations.map((loc, index) => (
                            <li 
                                key={index}
                                onClick={this.props.openInfoWindow.bind(this, loc.marker)}
                                onMouseEnter={this.handleMouseOver.bind(this, loc.marker)}
                            >
                            {loc.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hamburger" onClick={this.toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>      
                </div>
            </div>
        )
    }
}

export default SideBar