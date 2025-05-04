document.addEventListener("DOMContentLoaded", function () {
    const logBtn = document.querySelector(".log-btn");
    const fuelSelect = document.getElementById("fuel");
    const distanceInput = document.getElementById("distance");
    const logList = document.getElementById("activity-list");
    const timeButtons = document.querySelectorAll(".time-options button");

    let logs = JSON.parse(localStorage.getItem("activityLogs")) || [];

    // Unified logging function
    function logActivity() {
        const fuel = fuelSelect.value;
        const distance = parseFloat(distanceInput.value.trim());

        if (isNaN(distance) || distance <= 0) {
            alert("Please enter a valid distance.");
            return;
        }

        // Emission Factors (kg CO2 per mile)
        const emissionFactors = {
            gasoline: 0.2,
            diesel: 0.25,
            electric: 0.05,
            hybrid: 0.1
        };

        const emissions = (distance * (emissionFactors[fuel] || 0)).toFixed(2);
        const timestamp = new Date().toISOString();

        const newLog = {
            fuel,
            distance,
            emissions,
            date: timestamp
        };

        logs.push(newLog);
        localStorage.setItem("activityLogs", JSON.stringify(logs));

        distanceInput.value = "";
        fuelSelect.value = "gasoline";
        displayLogs(getCurrentFilter());
    }

    // Attach logging to button
    logBtn.addEventListener("click", logActivity);

    // Display logs by time filter
    function displayLogs(filter) {
        if (!logList) return;
        logList.innerHTML = "";

        const now = new Date();
        const filteredLogs = logs.filter(log => {
            const logDate = new Date(log.date);

            if (filter === "today") {
                return logDate.toDateString() === now.toDateString();
            } else if (filter === "week") {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                return logDate >= oneWeekAgo;
            } else if (filter === "month") {
                return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
            }
            return false;
        });

        if (filteredLogs.length === 0) {
            logList.innerHTML = "<li>No logs available for this period.</li>";
        } else {
            filteredLogs.forEach(log => {
                const item = document.createElement("li");
                item.innerHTML = `
                    <strong>Fuel:</strong> ${log.fuel} 
                    <strong>Distance:</strong> ${log.distance} miles 
                    <strong>CO2:</strong> ${log.emissions} kg
                `;
                logList.appendChild(item);
            });
        }
    }

    function getCurrentFilter() {
        const activeButton = document.querySelector(".time-options .active");
        if (!activeButton) return "today";

        const text = activeButton.textContent;
        if (text === "Today") return "today";
        if (text === "This Week") return "week";
        if (text === "This Month") return "month";
        return "today";
    }

    // Handle time filter switching
    timeButtons.forEach(button => {
        button.addEventListener("click", function () {
            timeButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const filter = getCurrentFilter();
            displayLogs(filter);
        });
    });

    // Initial display
    displayLogs("today");
});
