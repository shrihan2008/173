AFRAME.registerComponent("create-markers", {
  init: async function () {
    var mainScene = document.querySelector("#main-scene");
    var T01 = await this.getT01();
    T01.map(T01 => {
      var marker = document.createElement("a-marker");
      marker.setAttribute("id", T01.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", T01.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse"
      });
      marker.setAttribute("markerhandler", {});
      mainScene.appendChild(marker);

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

      if (!T01.unavailable_days.includes(days[todaysDay])) {
        // Adding 3D model to scene
        var model = document.createElement("a-entity");
        model.setAttribute("id", `model-${T01.id}`);
        model.setAttribute("position", T01.position);
        model.setAttribute("rotation", T01.rotation);
        model.setAttribute("scale", T01.scale);
        model.setAttribute("gltf-model", `url(${T01.model_url})`);
        model.setAttribute("gesture-handler", {});
        model.setAttribute("visible", false);
        marker.appendChild(model);

        // Ingredients Container
        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${T01.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 1.7);
        mainPlane.setAttribute("height", 1.5);
        mainPlane.setAttribute("visible", false);
        marker.appendChild(mainPlane);

        // T01 title background plane
        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${T01.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 1.69);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("material", { color: "#F0C30F" });
        mainPlane.appendChild(titlePlane);

        // T01 title
        var T01Title = document.createElement("a-entity");
        T01Title.setAttribute("id", `T01-title-${T01.id}`);
        T01Title.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        T01Title.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        T01Title.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: T01.T01_name.toUpperCase()
        });
        titlePlane.appendChild(T01Title);

        // Ingredients List
        var ingredients = document.createElement("a-entity");
        ingredients.setAttribute("id", `ingredients-${T01.id}`);
        ingredients.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
        ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        ingredients.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          align: "left",
          value: `${T01.ingredients.join("\n\n")}`
        });
        mainPlane.appendChild(ingredients);

        // T01 Price
        var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id", `price-plane-${T01.id}`);
        pricePlane.setAttribute(
          "src",
          "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
        pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        pricePlane.setAttribute("visible", false);

        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${T01.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${T01.price}`
        });

        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
        
        //ADD CODE HERE
        
        // T01 Rating plane
        var ratingplane=document.createElement("a-entity")
        ratingplane.setAttribute("id",`rating-plane-${T01.id}`)
        ratingplane.setAttribute("position",{x:2,y:0,z:0.5})
        ratingplane.setAttribute("geometry",{
          primitive:"plane",
          width:1.5,
          height:0.3
        })
        ratingplane.setAttribute("material",{color:"green"})
        ratingplane.setAttribute("rotation",{x:-90,y:0,z:0})
        ratingplane.setAttribute("visible",false)


        var rating=document.createElement("a-entity")
        rating.setAttribute("id",`rating-${T01.id}`)
        rating.setAttribute("position",{x:0,y:0.05,z:0.1})
        rating.setAttribute("rotation",{x:0,y:0,z:0})
        rating.setAttribute("text",{
          font:"mozillavr",
          color:"orange",
          width:2.4,
          align:"center",
          value:`customer rating:${T01.last_rating}`

        })
  
        ratingplane.appendChild(rating)
        marker.appendChild(ratingplane)

        
        

        // T01 review plane
        var reviewplane=document.createElement("a-entity")
        reviewplane.setAttribute("id",`review-plane-${T01.id}`)
        reviewplane.setAttribute("position",{x:2,y:0,z:0})
        reviewplane.setAttribute("geometry",{
          primitive:"plane",
          width:1.5,
          height:0.3
        })
        reviewplane.setAttribute("material",{color:"grey"})
        reviewplane.setAttribute("rotation",{x:-90,y:0,z:0})
        reviewplane.setAttribute("visible",false)
       
        // T01 review
        


        var review=document.createElement("a-entity")
        review.setAttribute("id",`review-${T01.id}`)
        review.setAttribute("position",{x:2,y:0,z:0})
        review.setAttribute("rotation",{x:-90,y:0,z:0})
        review.setAttribute("text",{
          font:"mozillavr",
          color:"blue",
          width:2.4,
          align:"center",
          value:`customer review:${T01.last_review}`

        })


          
        reviewplane.appendChild(review)
        marker.appendChild(reviewplane)
      }
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
  }
});
