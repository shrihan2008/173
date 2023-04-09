var tableNumber = null;

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    if (tableNumber === null) {
      this.askTableNumber();
    }

    var T01 = await this.getT01();

    this.el.addEventListener("markerFound", () => {
      if (tableNumber !== null) {
        var markerId = this.el.id;
        this.handleMarkerFound(T01, markerId);
      }
    });

    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },

  askTableNumber: function () {
    var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";

    swal({
      title: "Welcome to Hunger!!",
      icon: iconUrl,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your table number",
          type: "number",
          min: 1
        }
      }
    }).then(inputValue => {
      tableNumber = inputValue;
    });
  },

  handleMarkerFound: function (T01, markerId) {
    // Getting today's day
    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();
    // Sunday - Saturday : 0 - 6
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    // Changing Model scale to initial scale
    var T01 = T01.filter(T01 => T01.id === markerId)[0];

    if (T01.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: T01.T01_name.toUpperCase(),
        text: "This T01 is not available today!!!",
        timer: 2500,
        buttons: false
      });
    } else {
      // make model visible
      var model = document.querySelector(`#model-${T01.id}`);

      model.setAttribute("visible", true);

      // make ingredients Container visible
      var ingredientsContainer = document.querySelector(
        `#main-plane-${T01.id}`
      );
      ingredientsContainer.setAttribute("visible", true);

      // make Price Plane visible
      var pricePlane = document.querySelector(`#price-plane-${T01.id}`);
      pricePlane.setAttribute("visible", true);

      // make Rating Plane visible
      var ratingPlane = document.querySelector(`#rating-plane-${T01.id}`);
      ratingPlane.setAttribute("visible", true);

      // make review Plane visible
      var reviewPlane = document.querySelector(`#review-plane-${T01.id}`);
      reviewPlane.setAttribute("visible", true);

      var model = document.querySelector(`#model-${T01.id}`);
      model.setAttribute("position", T01.model_geometry.position);
      model.setAttribute("rotation", T01.model_geometry.rotation);
      model.setAttribute("scale", T01.model_geometry.scale);

      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");
      var orderSummaryButtton = document.getElementById("order-summary-button");
      var payButton = document.getElementById("pay-button");

      // Handling Click Events
      ratingButton.addEventListener("click", () => this.handleRatings(T01));

      orderButtton.addEventListener("click", () => {
        var tNumber;
        tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
        this.handleOrder(tNumber, T01);

        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Order !",
          text: "Your order will serve soon on your table!",
          timer: 2000,
          buttons: false
        });
      });

      orderSummaryButtton.addEventListener("click", () =>
        this.handleOrderSummary()
      );

      payButton.addEventListener("click", () => this.handlePayment());
    }
  },
  
  handleOrder: function (tNumber, T01) {
    // Reading currnt table order details
    firebase
      .firestore()
      .collection("tables")
      .doc(tNumber)
      .get()
      .then(doc => {
        var details = doc.data();

        if (details["current_orders"][T01.id]) {
          // Increasing Current Quantity
          details["current_orders"][T01.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_orders"][T01.id]["quantity"];

          details["current_orders"][T01.id]["subtotal"] =
            currentQuantity * T01.price;
        } else {
          details["current_orders"][T01.id] = {
            item: T01.T01_name,
            price: T01.price,
            quantity: 1,
            subtotal: T01.price * 1
          };
        }

        details.total_bill += T01.price;

        // Updating Db
        firebase
          .firestore()
          .collection("tables")
          .doc(doc.id)
          .update(details);
      });
  },
  getT01: async function () {
    return await firebase
      .firestore()
      .collection("T01")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },
  getOrderSummary: async function (tNumber) {
    return await firebase
      .firestore()
      .collection("tables")
      .doc(tNumber)
      .get()
      .then(doc => doc.data());
  },
  handleOrderSummary: async function () {
    // Changing modal div visibility
    var modalDiv = document.getElementById("modal-div");
    modalDiv.style.display = "flex";

    var tableBodyTag = document.getElementById("bill-table-body");

    // Removing old tr data
    tableBodyTag.innerHTML = "";

    // Getting Table Number
    var tNumber;
    tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;

    // Getting Order Summary from database
    var orderSummary = await this.getOrderSummary(tNumber);

    var currentOrders = Object.keys(orderSummary.current_orders);

    currentOrders.map(i => {
      var tr = document.createElement("tr");
      var item = document.createElement("td");
      var price = document.createElement("td");
      var quantity = document.createElement("td");
      var subtotal = document.createElement("td");

      item.innerHTML = orderSummary.current_orders[i].item;
      price.innerHTML = "$" + orderSummary.current_orders[i].price;
      price.setAttribute("class", "text-center");

      quantity.innerHTML = orderSummary.current_orders[i].quantity;
      quantity.setAttribute("class", "text-center");

      subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
      subtotal.setAttribute("class", "text-center");

      tr.appendChild(item);
      tr.appendChild(price);
      tr.appendChild(quantity);
      tr.appendChild(subtotal);
      tableBodyTag.appendChild(tr);
    });

    var totalTr = document.createElement("tr");

    var td1 = document.createElement("td");
    td1.setAttribute("class", "no-line");

    var td2 = document.createElement("td");
    td1.setAttribute("class", "no-line");

    var td3 = document.createElement("td");
    td1.setAttribute("class", "no-line text-cente");

    var strongTag = document.createElement("strong");
    strongTag.innerHTML = "Total";
    td3.appendChild(strongTag);

    var td4 = document.createElement("td");
    td1.setAttribute("class", "no-line text-right");
    td4.innerHTML = "$" + orderSummary.total_bill;

    totalTr.appendChild(td1);
    totalTr.appendChild(td2);
    totalTr.appendChild(td3);
    totalTr.appendChild(td4);

    tableBodyTag.appendChild(totalTr);
  },
  handlePayment: function () {
    // Close Modal
    document.getElementById("modal-div").style.display = "none";

    // Getting Table Number
    var tNumber;
    tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;

    // Reseting current orders and total bill
    firebase
      .firestore()
      .collection("tables")
      .doc(tNumber)
      .update({
        current_orders: {},
        total_bill: 0
      })
      .then(() => {
        swal({
          icon: "success",
          title: "Thanks For Paying !",
          text: "We Hope You Enjoyed Your Food !!",
          timer: 2500,
          buttons: false
        });
      });
  },

  handleRatings: async function (T01) {
    
    
    var tnumber;
    tableNumber<=9 ? (tnumber=`T0${tableNumber}`) : `T${tableNumber}`
     
    var ordersummary=await this.getOrderSummary(tnumber)
    var current_orders=Object.keys(ordersummary.currentOrders())

    if(current_orders.length>0 && current_orders==T01.id){


      document.getElementById("rating-modal-div").style.display="flex"
      document.getElementById("rating-input").value="0"
      document.getElementById("feedback-input").value=""
      var saveratingbutton=document.getElementById("save-rating-button")
      saveratingbutton.addEventListener("click",()=>{
        document.getElementById("rating-modal-div").style.display="none"
        var rating=document.getElementById("rating-input").value
        var feedback=document.getElementById("feedback-input").value

        firebase 
            .firestore()
            collection("T01")
            .doc(T01.id)
            .update({
              last_review:feedback,
              last_rating:rating
            })
            .then(()=>{
              swal({
                icon:"success",
                title:"Thanks for rating",
                text:"Visit next time",
                timer:1500,
                buttons:false

              })
            })
      })

    }

    else{
      swal({
        icon:"warning",
        title:"OOPSY!",
        text:"No T01 found to give rating",
        timer:1000,
        buttons:false
      })
    }
   
    
  },
  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }







});
