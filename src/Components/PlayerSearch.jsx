import React, { useState } from 'react';
import axios from 'axios';
import './PlayerSearch.css';

const App = () => {
    const [playerName, setPlayerName] = useState('');
    const [playerStats, setPlayerStats] = useState({});
    const [playerFullName, setPlayerFullName] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const playerId = await getPlayerId();
            if (playerId) {
                await getPlayerStats(playerId);
            }
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }

    const handleChange = (event) => {
        setPlayerName(event.target.value);
    }

    const getPlayerId = async () => {
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

        const response = await axios.get(`https://api.balldontlie.io/v1/players?${searchQuery}`, {
            headers: {
                'Authorization': 'a89a1c7f-8022-4a5a-92d9-e5617e88c606'
            }
        });

        const playerData = response.data.data;
        if (!playerData || playerData.length === 0) {
            alert("No player found with this name");
            return;
        }

        if (playerData.length > 1) {
            alert("Multiple players found. Please specify the full name.");
            return;
        }

        const player = playerData[0];
        setPlayerFullName(`${player.first_name} ${player.last_name}`);
        return player.id;
    }

    const getPlayerStats = async (playerId) => {
        const response = await axios.get(`https://api.balldontlie.io/v1/season_averages?season=2023&player_ids[]=${playerId}`, {
            headers: {
                'Authorization': 'a89a1c7f-8022-4a5a-92d9-e5617e88c606'
            }
        });
        const playerStats = response.data.data[0] || {};
        setPlayerStats(playerStats);
    }

    const showStats = Object.keys(playerStats).length !== 0;

    return (
        <div className='App'>
            <h1>Stats<span>Box</span></h1>
            <form onSubmit={handleSearch}>
                <label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={handleChange}
                        placeholder="Search players & stats"
                    />
                </label>
                <input type="submit" value="Search" />
            </form>
            {showStats && (
                <h2 className='player-name'>{playerFullName}</h2>
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

export default App;
