import React, {useRef, useState, useEffect, useContext} from 'react';
import './css/creatureCard.css';

const CreatureCard = ({typeInfo}) => {

  const createFoodString = (array) => {
    let str = "NONE";
    for (let i = 0; i < array.length; i++) {
      if (i === 0) {
        str = "";
      }

      str += array[i];

      if (i !== array.length - 1) {
        str += ', ';
      }
    }
    return str;
  }

  const name = `${typeInfo.type}`;

  const color = typeInfo.color;
  const size = `${typeInfo.size}`;
  const displayStyle = {
    backgroundColor: `${color}`,
    width: `${typeInfo.size}px`,
    height: `${typeInfo.size}px`,
  }
  const display = <div className="creature-icon"><div style={displayStyle}></div></div>;

  const speed = `${typeInfo.speed}`;
  const energyWhenEaten = `${typeInfo.energy}`;

  const foodPerDay = `${typeInfo.foodNeeded} meals/day`;
  const plants = `${createFoodString(typeInfo.food.plants)}`
  const prey = `${createFoodString(typeInfo.food.prey)}`;

  const sleep = `${typeInfo.sleepNeeded} hrs/day`;

  const mating = `every ${typeInfo.matingNeeded} day(s)`;
  const offspring = `${typeInfo.minOffspring}-${typeInfo.maxOffspring}`;
  const multipleLitters = `${typeInfo.canHaveMultipleLitters}`;
  const shelterProvider = `${typeInfo.genderOfShelterMaker}`;

  const lifespan = `${typeInfo.lifeSpanRange.low}-${typeInfo.lifeSpanRange.high} days`;
  const lifeAsChild = `${typeInfo.fractionAsChild * 100}%`;
  const lifeAsElder = `${typeInfo.fractionAsElder * 100}%`;

  const specialTraits = '';
  const description = '';

  return (
    <div className="card">
      {display}
      <b>Type:</b> {name}<br></br>
      <b>Size:</b> {size}<br></br>
      <b>Speed:</b> {speed}<br></br>
      <br></br>
      <b>Lifespan: </b> {lifespan}<br></br>
      <b>As child: </b>{lifeAsChild}<br></br>
      <b>As elder: </b>{lifeAsElder}<br></br>


      <br></br>
      <b>Plants to eat:</b> {plants}<br></br>
      <b>Prey to eat:</b> {prey}<br></br>
      <b>Energy to predator:</b> {energyWhenEaten}<br></br>
      <br></br>
      <b>Food needed:</b> {foodPerDay}<br></br>
      <b>Sleep needed:</b> {sleep}<br></br>
      <b>Mating:</b> {mating}<br></br>
      <br></br>
      <b>Offspring at once:</b> {offspring}<br></br>
      <b>Multiple litters?:</b> {multipleLitters}<br></br>
      <b>Shelter provider:</b> {shelterProvider}<br></br>
      <br></br>


    </div>
  );
    
  
}

export default CreatureCard;