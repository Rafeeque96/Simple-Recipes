const API = "https://www.themealdb.com/api/json/v1/1/"
const searchField = document.querySelector(".searchField")
const recipeList = document.querySelector(".recipeList")
const appModal = document.querySelector(".appModal")
const modalClose = document.querySelector(".modalClose")
const mealPic = document.querySelector(".mealPic")
const mealTitle = document.querySelector(".mealTitle")
const mealIngredients = document.querySelector(".mealIngredients")
const mealInstructions = document.querySelector(".mealInstructions")

// implement Search Function
searchField.addEventListener("submit", handleSearch)

function handleSearch(e){
  e.preventDefault()
  let query = e.target.recipeSearch.value 
  let recipesUrl = `${API}search.php?s=${query}`
  fetchData(recipesUrl).then(function(data){
      let results = createResultsHTML(data.meals)  
      recipeList.innerHTML = results   
  })    
}
async function fetchData(url){
  let response = await fetch(url)
  let data = await response.json()
  return data
}

// console.dir(fetchData("fish"))

function createResultsHTML(data){
    let myhtml ;
    if(data== null){
      myhtml = `<h3 class="searchError"> No results!  try a different Search </h3>`
    } else{
    myhtml = data.map(function(meal){
        return `<div class="recipeItem" data-id=${meal.idMeal}>
        <div class="recipePic">
          <img
            src=${meal.strMealThumb}
            alt=""
          />
        </div>
        <h2>${meal.strMeal}</h2>
        <h4>${meal.strCategory}</h4>
      </div>`
    }).join("")
  }
    return myhtml
}

document.addEventListener("click",handleMealInfo)
function handleMealInfo(e){
  // console.log(e.target.parentElement)
  if(e.target.parentElement.classList.contains("recipeItem")){
    let id = e.target.parentElement.dataset.id;
    let mealUrl = `${API}lookup.php?i=${id}`;
    // console.log(mealUrl)
    fetchData(mealUrl).then(function(data){
      // console.log(data.meals[0])
      let recipe = data.meals[0]
      appModal.classList.add("active")
      document.body.style.overflow = "hidden"
      mealTitle.innerHTML = `<h2>${recipe.strMeal} </h2> <h4>${recipe.strCategory} </h4>`
      mealPic.innerHTML = `<img src=${recipe.strMealThumb}/>`
      mealInstructions.innerHTML = recipe.strInstructions
      createIngredientList(recipe)
    })
  }
}
function createIngredientList(recipe){
  let list = ""
  for(let i=1;i<=20;i++ ){
     if(recipe["strIngredient"+i] === "" || recipe["strIngredient"+ i ] === null){
       break;
     }
    list += `<li> ${recipe["strIngredient" + i]} - ${recipe["strMeasure" + i]} </li>`
  }
  mealIngredients.innerHTML = `<ul> ${list} </ul>$`
}
modalClose.addEventListener("click",function(){
  appModal.classList.remove("active")
  document.body.style.overflow = "auto"
})



