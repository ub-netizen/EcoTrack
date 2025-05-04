document.addEventListener("DOMContentLoaded", function () {
    const leaderboardList = document.getElementById("leaderboard-list");

    let logs = JSON.parse(localStorage.getItem("activityLogs")) || [];

    if (!logs || logs.length === 0) {
        leaderboardList.innerHTML = "<li>No logs to show on the leaderboard.</li>";
        return;
    }

    logs.forEach(log => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span class="username">${log.username}</span>
            <span class="distance">${log.distance} miles (${log.vehicle})</span>
            <span class="co2">${log.emissions} kg CO2</span>
        `;
        leaderboardList.appendChild(listItem);
    });
});
console.log(logs);  // Add this line to see the logs in the console
