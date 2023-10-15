let selected_date;
let selected_time;
let cal_event;
const starting_time = 6;
const slots = 16;

document.addEventListener("keydown", (e) => {
    if (e.key === "/") {
        console.log("hi");
        document.getElementById("month_selector").showPicker();
    }
})
const month_selector = document.getElementById("month_selector");
function getDays(month) {
    const today = new Date();
    return new Date(today.getFullYear(), parseInt(month), 0).getDate();
}
function handleBooking() {
    axios.post("/createbooking", {
        date: selected_date,
        time: selected_time,
        name: "Abir Banerjee",
        userName: "abir",
    });
    const popup = document.querySelector(".popup");
    show_times(cal_event);
    popup.hidden = true;
}
async function show_times(calendar_event) {
    selected_date = calendar_event.target.value;
    const maindiv = document.querySelector(".calendar");
    if (selected_date === "") {
        maindiv.innerHTML = "";
        return;
    }
    cal_event = calendar_event;
    const response = await axios.post("/getbookings", {
        date: selected_date,
    });

    let existing_bookings = [];
    response.data.forEach((booking) => {
        existing_bookings.push(booking.time);
    });

    maindiv.innerHTML = "";
    for (let i = 0; i < slots; i++) {
        const times = document.createElement("div");
        times.setAttribute("id", "times");
        times.setAttribute("tabindex", i + 1);
        times.innerText =
            (i + starting_time).toString().padStart(2, "0") +
            ":00" +
            " to " +
            (i + starting_time + 1).toString() +
            ":00";

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.target.click();
            }
        })
        if (existing_bookings.indexOf(times.innerText.slice(0, 5)) === -1) {
            times.classList.add("open");
            times.addEventListener("click", (e) => {
                selected_time = e.target.innerText.slice(0, 5);
                const popup = document.querySelector(".popup");
                if (!popup.childNodes[0]) {
                    const confirmTxt = document.createElement("h2");
                    confirmTxt.innerHTML =
                        "Confirm booking on: " +
                        selected_date +
                        ", at " +
                        e.target.innerText +
                        "?";

                    popup.append(confirmTxt);
                } else {
                    popup.childNodes[0].innerHTML =
                        "Confirm booking on: " +
                        selected_date +
                        ", at " +
                        e.target.innerText +
                        "?";
                }
                if (popup.childNodes.length < 2) {
                    const button_div = document.createElement("div");
                    button_div.classList.add("button_div");

                    const confirm_button = document.createElement("button");
                    confirm_button.setAttribute("id", "confirm");
                    confirm_button.addEventListener("click", handleBooking);
                    confirm_button.innerText = "Confirm";

                    const cancel_button = document.createElement("button");
                    cancel_button.setAttribute("id", "cancel");
                    cancel_button.addEventListener("click", () => {
                        popup.hidden = true;
                    });
                    cancel_button.innerText = "Cancel";
                    button_div.append(confirm_button);
                    button_div.append(cancel_button);
                    popup.append(button_div);
                    document.body.addEventListener("keydown", (e) => {
                        if (e.key === "Escape") cancel_button.click();
                    });
                }
                popup.hidden = false;
                document.querySelector(".popup").focus();
            });
        } else {
            times.classList.add("booked");
            if (
                response.data[
                    existing_bookings.indexOf(times.innerText.slice(0, 5))
                ].userName &&
                response.data[
                    existing_bookings.indexOf(times.innerText.slice(0, 5))
                ].userName === "abir"
            ) {
                const your_booking = document.createElement("h4");
                your_booking.innerText = "Booked by you!";
                times.append(your_booking);
            }
        }

        maindiv.append(times);
    }
}
const today = new Date();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const date = today.getDate();
const nextMonth = today.getMonth() + 2;
const min = year + "-" + month + "-" + date;
const max = year + "-" + nextMonth + "-" + getDays(nextMonth);
month_selector.min = min;
month_selector.max = max;
month_selector.addEventListener("change", show_times);