import React, { Component } from 'react';
import axios from 'axios';
import './PlayerSearch.css';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            playerName: '',
            playerStats: {},
            playerFullName: '',
            playerInfo: {},
        }
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.getPlayerId();
    }

    handleChange = (event) => {
        this.setState({ playerName: event.target.value });
    }

    getPlayerId = () => {
        const { playerName } = this.state;
        const names = playerName.split(" ");
        let searchQuery;

        if (names.length === 1) {
            alert("Please specify player's name");
            return;
        } else if (names.length === 2) {
            searchQuery = `first_name=${names[0]}&last_name=${names[1]}`;
        } else {
            const firstName = names.slice(0, -1).join(" ");
            searchQuery = `first_name=${firstName}&last_name=${names[names.length - 1]}`;
        }

        axios.get(`https://api.balldontlie.io/v1/players?${searchQuery}`, {
            headers: {
                'Authorization': 'a89a1c7f-8022-4a5a-92d9-e5617e88c606'
            }
        })
            .then(async response => {
                const playerData = response.data.data;
                if (!playerData || playerData.length === 0) {
                    alert("No player found with this name");
                    return;
                }

                if (playerData.length > 1) {
                    alert("Multiple players found. Please specify the full name.");
                    return;
                }

                const player = playerData[0]; // Just take the first player if mult matches are found
                const playerId = player.id;
                this.getPlayerStats(playerId);
                this.setState({ playerFullName: `${player.first_name} ${player.last_name}` });
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });
    }

    getPlayerStats = (playerId) => {
        axios.get(`https://api.balldontlie.io/v1/season_averages?season=2023&player_ids[]=${playerId}`, {
            headers: {
                'Authorization': 'a89a1c7f-8022-4a5a-92d9-e5617e88c606'
            }
        })
            .then(response => {
                const playerStats = response.data.data[0] || {};
                this.setState({ playerStats });
            })
            .catch(error => {
                console.error('Error fetching player stats:', error);
            })
    }

    render() {
        const { playerStats, playerFullName } = this.state;
        const showStats = Object.keys(playerStats).length !== 0;

        return (
            <div className='App'>
                <h1>Stats<span>Box</span></h1>
                <form onSubmit={this.handleSearch}>
                    <label>
                        <input
                            type="text"
                            value={this.state.playerName}
                            onChange={this.handleChange}
                            placeholder="Search players & stats"
                        />
                    </label>
                    <input type="submit" value="Search" />
                </form>
                {showStats && (
                    <h2>{playerFullName}</h2>
                )}
                {showStats && (
                    <div className="stats-container">
                        <div className="stat-box">
                            <p>Season: {playerStats && playerStats.season}</p>
                        </div>
                        <div className="stat-box">
                            <p>GP: {playerStats && playerStats.games_played}</p>
                        </div>
                        <div className="stat-box">
                            <p>PPG: {playerStats && playerStats.pts && playerStats.pts.toFixed(1)}</p>
                        </div>
                        <div className="stat-box">
                            <p>APG: {playerStats && playerStats.ast && playerStats.ast.toFixed(1)}</p>
                        </div>
                        <div className="stat-box">
                            <p>RPG: {playerStats && playerStats.reb && playerStats.reb.toFixed(1)}</p>
                        </div>
                        <div className="stat-box">
                            <p>STL: {playerStats && playerStats.stl && playerStats.stl.toFixed(1)}</p>
                        </div>
                        <div className="stat-box">
                            <p>BPG: {playerStats && playerStats.blk && playerStats.blk.toFixed(1)}</p>
                        </div>
                        <div className="stat-box">
                            <p>FG%: {playerStats && playerStats.fg_pct && `${(playerStats.fg_pct * 100).toFixed(1)}%`}</p>
                        </div>
                        <div className="stat-box">
                            <p>3PT%: {playerStats && playerStats.fg3_pct && `${(playerStats.fg3_pct * 100).toFixed(1)}%`}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

}

export default App;
