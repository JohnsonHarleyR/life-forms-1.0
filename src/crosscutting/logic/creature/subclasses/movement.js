import { LifeStage, ActionType, NeedType } from "../../../constants/creatureConstants";
import { Direction } from "../../../constants/creatureConstants";
import { determineSightCoordinates,
    getRandomShelterPosition,
    determineSightDirection,
    getRandomCreatureStartPosition,
    getPositionInNewDirection,
    checkSightAreaForItemInArray,
    canSetShelterInPosition,
    searchAreaForMate} from "../creatureLogic";
import { MoveMode } from "../../../constants/creatureConstants";
import { CanvasInfo } from "../../../constants/canvasConstants";
import { ShelterLine } from "../../../constants/canvasConstants";
import { FoodType } from "../../../constants/objectConstants";
import { isInPosition, getPositionDifference, getTriangleMovePosition,
    getRandomStartPosition, addItemToArray } from "../../universalLogic";
import { checkAllCreatureObjectCollisions, 
  determineDirectionByTarget } from "../../object/objectsLogic";
import Shelter from "./shelter";
import { 
  makeCreatureDie,
  makeCreatureSleep,
  eatFood,
  creatureHasFoodInInventory,
  creatureHasFoodInShelter,
  eatFoodFromInventory,
  eatFoodFromShelter,
  findFoodTargetInArea,
  putTargetInFoodInventory,
  addFoodToShelter
} from "./logic/actionLogic";

export default class CreatureMovement {
    constructor(creature, sightRadius, sightDistance, speed) {
        this.creature = creature;
        this.sightRadius = sightRadius;
        this.sightDistance = sightDistance;
        this.speed = speed;
        this.direction = {
            x: null,
            y: null
        };
        this.moveMode = MoveMode.THINK;

        this.sideOfCollision = null;
        this.previousSide = null;
        this.newDirection = null;
        this.previousDirection = null;
    }

    updateMovement = (objects, plants, creatures, shelters, CanvasInfo) => {
        
        // if previous priority is different than new priority, set mode to think mode
        if (this.creature.needs.previousPriority === null || 
            this.creature.needs.previousPriority !== this.creature.needs.priority || 
            this.creature.needs.prioriityComplete) {
              console.log(`Creature ${this.creature.id} about to think`);
                this.moveMode = MoveMode.THINK;
                this.resetMovementProperties(); // keey?
              if (this.creature.needs.prioriityComplete) {
                console.log('priority complete');
                this.creature.needs.priorityComplete = false;
              }
        }

        // if creature is thinking, determine move mode based on priority
        if (this.moveMode === MoveMode.THINK) {
          console.log(`Creature ${this.creature.id} thinking`);
            this.determineModeByPriority();
            this.creature.targetPosition = this.getInitialTargetPosition(objects, creatures, plants, shelters);
        }

        // now move
        this.move(objects, plants, creatures, shelters, CanvasInfo, this.creature.targetPosition);
        
    }

    resetMovementProperties = () => {
        this.direction = {
            x: null,
            y: null
        };
        this.sideOfCollision = null;
        this.previousSide = null;
        this.newDirection = null;
    }

    move = (objects, plants, creatures, shelters, canvasInfo, targetPosition = null) => {
        //console.log(`${this.creature.id} start: ${JSON.stringify(this.creature.position)}`);

        
        //console.log('moving creature');
        // if the creature is dead, don't move at all.
        if (this.creature.life.lifeStage === LifeStage.DECEASED || 
            this.moveMode === MoveMode.NONE) {
            return;
        }

        // setting a target position is not required but there is an option
        if (targetPosition !== null) {
            this.creature.targetPosition = targetPosition;
        }
        let endPosition = this.creature.targetPosition;
        let newPosition = this.position;

        switch (this.moveMode) {
            default:
            case MoveMode.STAND_STILL:
              //console.log('STAND_STILL');
              newPosition = this.standStill(creatures);
              break;
            case MoveMode.TOWARD_POINT:
              newPosition = this.moveToPoint(endPosition, objects, creatures, shelters);
              break;
            case MoveMode.WANDER:
              //console.log('wandering');
              newPosition = this.moveToRandomPosition(objects, canvasInfo);
              break;
            case MoveMode.SEARCH:
              // first wander
              // then look at the result to see
              newPosition = this.searchForTarget(plants, creatures, objects, shelters, canvasInfo);
              break;
            case MoveMode.GO_TO_SHELTER:
              newPosition = this.moveToPoint(endPosition, objects, creatures, shelters);
              if (newPosition.x === endPosition.x && newPosition.y === endPosition.y) {
                this.moveMode = MoveMode.THINK;
              }
              break;
            case MoveMode.COMPLETE_MATING:
              console.log('COMPLETE_MATING');
              this.creature.mating.produceOffspring();
              newPosition = this.creature.position;
              break;
          }

        this.creature.position = newPosition;

        //console.log(`${this.creature.id} end: ${JSON.stringify(newPosition)}`);
    }

    determineModeByPriority = () => {
        switch(this.creature.needs.priority) {
            default:
            case ActionType.NONE:
                //this.searchNeed = NeedType.NONE;
                this.creature.targetType = NeedType.NONE;
                this.resetMovementProperties();
                this.moveMode = MoveMode.STAND_STILL;
                break;
            case ActionType.DIE:
              this.creature.targetType = NeedType.NONE;
              this.moveMode = MoveMode.STAND_STILL;
            case ActionType.SLEEP_IN_SPOT:
              this.creature.targetType = NeedType.SLEEP;
              this.moveMode = MoveMode.STAND_STILL;
            case ActionType.CREATE_SHELTER:
                // if the creature's shelter is not null anymore,
                // set their priority to complete
                if (this.creature.safety.shelter !== null) {
                    this.creature.needs.priorityComplete = true;
                    //this.resetMovementProperties();
                    this.moveMode = MoveMode.STAND_STILL;
                } else {
                    this.creature.targetType = NeedType.SHELTER;
                    this.moveMode = MoveMode.SEARCH;
                }
                break;
            case ActionType.FIND_MATE:
              this.creature.targetType = NeedType.MATE;
              this.moveMode = MoveMode.SEARCH;
              break;
            case ActionType.FEED_SELF:
              console.log(`creature ${this.creature.id} determineModeByPriority: FEED_SELF`);
                this.creature.targetType = NeedType.FOOD_FOR_SELF;
                this.moveMode = MoveMode.SEARCH;
                break;
            case ActionType.FEED_FAMILY:
              console.log(`creature ${this.creature.id} determineModeByPriority: FEED_FAMILY`);
                this.creature.targetType = NeedType.FOOD_FOR_FAMILY;
                this.moveMode = MoveMode.SEARCH;
                break;
            case ActionType.MATE:
              if (this.creature.safety.shelter) {
                this.creature.targetType = NeedType.MATE;
                let centerPosition = this.creature.safety.shelter.getCenterPosition();
                if (isInPosition(this.creature.position, centerPosition) && 
                isInPosition(this.creature.family.mate.position, centerPosition)) {
                  this.moveMode = MoveMode.COMPLETE_MATING;
                } else {
                  this.moveMode = MoveMode.GO_TO_SHELTER;
                }
              } else {
                console.log(`error: creature ${this.creature.id} has no shelter`);
              }

              break;
            case ActionType.HAVE_CHILD:
              console.log(`creature ${this.creature.id} HAVE_CHILD`);
              this.moveMode = MoveMode.STAND_STILL;

        }
    }

    getInitialTargetPosition = (objects, creatures, plants, shelters) => {
        switch(this.creature.needs.priority) {
            default:
            case ActionType.NONE:
                return this.creature.targetPosition; // temp
            case ActionType.DIE:
            case ActionType.SLEEP_IN_SPOT:
              return this.creature.position;
            case ActionType.CREATE_SHELTER:
                return getRandomShelterPosition(this.creature, creatures, objects, shelters);
            case ActionType.FEED_SELF:
            case ActionType.FEED_FAMILY:
                return this.creature.position; // temp
            case ActionType.MATE:
              if (this.creature.safety.shelter) {
                return this.creature.safety.shelter.getCenterPosition();
              } else {
                return this.creature.position;
              }

        }
    }

    standStill = (creatures) => {
      //console.log(`creature ${this.creature.id} is standing still`);
      // do actions depending on action type
      switch (this.creature.needs.priority) {
        default:
          break;
        case ActionType.DIE:
          makeCreatureDie(this.creature);
          break;
        case ActionType.SLEEP_IN_SPOT:
          makeCreatureSleep(this.creature);
        case ActionType.HAVE_CHILD:
          console.log(`having child`);
          this.creature.mating.haveChild(creatures);
          break;
      }

      return this.creature.position;
    }

    searchForTarget = (plants, creatures, objects, shelters, canvasInfo) => {

        // FIRST see if there are other things needed to be searched for besides food
        // A shelter should be the first thing to find!
        if (this.creature.targetType === NeedType.SHELTER) {
            
            
        } else if (this.creature.targetType === NeedType.FOOD_FOR_SELF) {
        }
    
        let newPosition = this.creature.position;
    
    
        if (this.creature.targetType === NeedType.SHELTER) {
            newPosition = this.searchForShelter(plants, creatures, objects, shelters, canvasInfo);
        // searching for a mate
        } else if (this.creature.targetType === NeedType.MATE) {
          newPosition = this.searchForMate(plants, creatures, objects, shelters, canvasInfo);
        } else if (this.creature.targetType === NeedType.FOOD_FOR_SELF) {
          console.log(`creature ${this.creature.id} searchForTarget: searchForFoodForSelf`);
          newPosition = this.searchForFoodForSelf(plants, creatures, objects, shelters, canvasInfo);
        } else if (this.creature.targetType === NeedType.FOOD_FOR_FAMILY) {
          console.log(`creature ${this.creature.id} searchForTarget: searchForFoodForFamily`);
          newPosition = this.searchForFoodForFamily(plants, creatures, objects, shelters, canvasInfo);
        }
    
    
        
    
        return newPosition;
      }

    searchForFoodForSelf = (plants, creatures, objects, shelters, canvasInfo) => {
      // first determine if creature has food in shelter or personal inventory
      if (creatureHasFoodInShelter(this.creature)) {
        //console.log(`creature ${this.creature.id} has food in shelter`);
        if (this.creature.safety.shelter.isInsideShelter(this.creature)) { // if inside shelter, eat from shelter inventory
          //console.log(`creature ${this.creature.id} is inside shelter`);
          eatFoodFromShelter(this.creature);
          this.creature.currentTarget = null;
          return this.creature.position;
        } else { // otherwise move to the creature's shelter to eat
          //console.log(`creature ${this.creature.id} is moving to shelter`);
          return this.moveToPoint(this.creature.safety.shelter.getCenterPosition(), objects, creatures, shelters, canvasInfo);
        }

      } else if (creatureHasFoodInInventory(this.creature)) {
        //console.log(`creature ${this.creature.id} has food in inventory`);
        eatFoodFromInventory(this.creature);
        this.creature.currentTarget = null;
        return this.creature.position;
        
      } else if (this.creature.life.lifeStage === LifeStage.CHILD) { // if child there's not much else to do but be hungry
        //console.log(`creature ${this.creature.id} is child`);
        return this.creature.position; // TODO change to moving to random position in shelter

      } else { // otherwise search for food!
        //console.log(`creature ${this.creature.id} needs to search elsewhere for food`);
        return this.searchForFoodTarget(plants, creatures, objects, shelters, canvasInfo);
      }
    }

    searchForFoodForFamily = (plants, creatures, objects, shelters, canvasInfo) => {
      // if shelter and if the amount of food in the shelter inventory is greater than the amount to gather at once, let the creature get food for themselves
      if (this.creature.safety.shelter && this.creature.safety.shelter.inventory.food.length > this.creature.inventory.foodToGatherAtOnce) {
        return this.searchForFoodForSelf(plants, creatures, objects, shelters, canvasInfo);
      } // otherwise, if shelter and if the amount of food in their own inventory is greater than or equal to the amount to gather at once, take that food to shelter inventory
      else if (this.creature.safety.shelter && this.creature.inventory.food.length >= this.creature.inventory.foodToGatherAtOnce) {
        // see if creature is inside shelter - if they are, put creature food into shelter inventory
        if (this.creature.safety.shelter.isInsideShelter(this.creature)) {
          addFoodToShelter(this.creature);
          return this.creature.position;

        }  // if they are not, head for the shelter!
        else {
          this.creature.targetPosition = this.creature.safety.shelter.getCenterPosition();
          return this.moveToPoint(this.creature.safety.shelter.getCenterPosition(), objects, creatures, shelters, canvasInfo);
        }


      } // otherwise, search for food
      else {
        return this.searchForFoodTarget(plants, creatures, objects, shelters, canvasInfo);
      }

      
    }

    searchForFoodTarget = (plants, creatures, objects, shelters, canvasInfo) => {
      let newPosition = this.creature.position;
      // if there is a current target, move toward it and then check if in same position. If so, put target in inventory.
      if (this.creature.currentTarget !== null) {
        //console.log(`creature ${this.creature.id} has food target, moving toward target`);
        newPosition = this.moveToPoint(this.creature.currentTarget.position, objects, creatures, shelters, canvasInfo);
        if (isInPosition(newPosition, this.creature.currentTarget.position)) {
          //console.log(`creature ${this.creature.id} has captured food target`);
          putTargetInFoodInventory(this.creature);
        }

         // if there is no current target, search for a target. If one is found, set that to new target and move toward it
      } else {
        //console.log(`creature ${this.creature.id} searching for food in area`);
        let newTarget = findFoodTargetInArea(this.creature, plants, creatures, canvasInfo);
        if (newTarget !== null) {
          this.creature.currentTarget = newTarget;
          //console.log(`creature ${this.creature.id} has new food target found`);
          this.creature.targetPosition = newTarget.position;
          newPosition = this.moveToPoint(newTarget.position, objects, creatures, shelters, canvasInfo);
        // if there is no target, move to random position
        } else {
          //console.log(`creature ${this.creature.id} sees no food, moving toward random position`);
          newPosition = this.moveToRandomPosition(objects, creatures, shelters, canvasInfo);
        }
        
      }
      return newPosition;
    }

    searchForMate = (plants, creatures, objects, shelters, canvasInfo) => {

      // first determine if they already have a mate target or are a mate target
      if (this.creature.mating.hasMateTarget) {
        this.creature.targetPosition = this.creature.mating.mateTarget.position; // make mate position the target
        // now check if they are in the same position - if so, make that creature their mate
        let newPosition = this.moveToPoint(this.creature.targetPosition, objects, creatures, shelters, canvasInfo);
        if (isInPosition(newPosition, this.creature.targetPosition)) {
          let newMate = this.creature.mating.mateTarget;
          this.creature.mating.makeMate(newMate);
          // also change the move mode to think for both creatures so they can proceed to mate
          this.moveMode = MoveMode.THINK;
          newMate.movement.moveMode = MoveMode.THINK;
        }
        return newPosition;
      } else if (this.creature.mating.isMateTarget) { // if they are a target, just stay in the same position
        return this.creature.position;
      } else {

        // check for a mate in search area
        let mateResult = searchAreaForMate(this.creature, creatures);

        // if it found one, set the target position to that creature's position
        // TODO check if they are in the same position - if they are, make them mates
        if (mateResult.isMateFound) {
          console.log(`Mate found for ${this.creature.id}: ${mateResult.newMate.id}`);
          this.creature.mating.makeMateTarget(mateResult.newMate);
          this.creature.targetPosition = mateResult.newMate.position;
          return this.moveToPoint(this.creature.targetPosition, objects, creatures, shelters, canvasInfo);
        } else { // if there's no targeted mate/mate targeting them, then move to random spot to look for a mate
          return this.moveToRandomPosition(objects, creatures, shelters, canvasInfo);
        }
      }


    }

    searchForShelter = (plants, creatures, objects, shelters, canvasInfo) => {
        //console.log('searchForShelter');
        let newPosition = this.creature.position;
    
        // if a position does exist, move toward that position
        // then set it to move to that position.

        // TODO check for predators in the area - change target to random spot if there is one
        // ensure that the target position still does not overlap with any shelters


        // for now do testing with this to get methods writting
        newPosition = this.moveToPoint(this.creature.targetPosition, objects, creatures, shelters, canvasInfo);
    
        // check if the creature is in that position. If so, create a shelter.
        if (isInPosition(this.creature.position, this.creature.targetPosition)) {

          // let shelterId = `sh${shelters.length}`;
          // let newShelter = new Shelter(shelterId, this.creature.position, this.creature.color, this.creature.size);
          // newShelter.addMemberToShelter(this.creature);
          // addItemToArray(newShelter, shelters, this.creature.setShelters);

          if (!canSetShelterInPosition(this.creature.targetPosition, this.creature, creatures, objects, shelters)) {
            this.creature.targetPosition = getRandomShelterPosition(this.creature, creatures, objects, shelters);
            return this.searchForShelter(plants, creatures, objects, shelters, canvasInfo);
          } else {
            let shelterId = `sh${shelters.length}`;
            let newShelter = new Shelter(shelterId, this.creature.position, this.creature.color, this.creature.size);
            newShelter.addMemberToShelter(this.creature);
            addItemToArray(newShelter, shelters, this.creature.setShelters);
          }

        }
    
        // return new position
        return newPosition;
    }

    moveToPoint = (endPosition, objects, creatures, shelters, canvasInfo) => {
      
      this.previousDirection = this.direction !== null ? {...this.direction} : null;
      this.previousSide = this.sideOfCollision;

      let newPosition = this.creature.position;

      let result = this.moveTowardPosition(endPosition, objects, canvasInfo);
      if (result.success) {
        this.sideOfCollision = null;
          newPosition = result.forPosition;
          //this.finishedFirstDirection = false;
          // // reset avoid object variables if they need to be reset
          if (this.newDirection) {
            //console.log(`Going in new direction around object`);
            this.newDirection = null;
            this.previousSide = null;
          }
    
        } else {
          //console.log(`object collision at point ${JSON.stringify(result.forPosition)}. Moving around object.`);
          this.objectCollided = result.objectCollided;
          newPosition = this.moveAroundObject(
            result.objectCollided,
            result.collisionSide,
            canvasInfo
          );
        }

      return newPosition;
    }

    moveToRandomPosition = (objects, creatures, shelters, canvasInfo) => {
        //console.log('moveToRandomPosition');
            //console.log('moving to random position');
    // if creature is in the current target position, set the target position to a new random one
    if (isInPosition(this.creature.position, this.creature.targetPosition)) {
      //console.log(`creature ${this.creature.id} is in position, targetting new position`);
      this.resetMovementProperties();
      let newTargetPosition = getRandomStartPosition(this.creature, creatures, objects,[], shelters, 0, this.creature.id, false);
      //console.log(`current position: ${JSON.stringify(this.creature.position)}; new target position: ${JSON.stringify(newTargetPosition)}`);
      this.creature.targetPosition = newTargetPosition;
      //this.logMovementProperties();
    }
    //console.log(`creature ${this.creature.id} moving to position ${JSON.stringify(this.creature.targetPosition)}`);
    return this.moveToPoint(this.creature.targetPosition, objects, creatures, shelters, canvasInfo);
    }

    moveAroundObject = (obj, collisionSide, canvasInfo) => {
      //console.log(`Collision side: ${collisionSide}`);
      this.sideOfCollision = collisionSide;
      if (this.newDirection === null || this.previousSide !== collisionSide) {
        this.newDirection = determineDirectionByTarget(this.creature, this.sideOfCollision, obj, canvasInfo);
      //console.log(`new direction: ${this.newDirection}`);
      }
      this.previousSide = collisionSide;

      // now determine the new position based on the new direction
      let newPosition = getPositionInNewDirection(this.creature, this.newDirection);

      return newPosition;
    }

    moveTowardPosition = (endPosition, objects) => {
        let newPosition = { x: this.creature.position.x, y: this.creature.position.y };

        let dif = getPositionDifference(this.creature.position, endPosition);
        this.setDirection(dif.xDifference, dif.yDifference);
        console.log(`Direction for ${this.creature.gender} ${this.creature.type} ${this.creature.id}: {x: ${this.direction.x}, y: ${this.direction.y}}` + 
          `${this.creature.position}`);
    
        // if a direction is null, that means it's not going in any direction
        // so set the new position to be the same as the end position
        if (this.direction.x === null) {
          newPosition.x = endPosition.x;
        }
    
        if (this.direction.y === null) {
          newPosition.y = endPosition.y;
        }
    
        // if neither direction is null, that means it's moving
        // in a diagonal
        if (this.direction.x !== null && this.direction.y !== null) {
          let triangeResult = getTriangleMovePosition(
            this.creature.position,
            Math.abs(dif.xDifference),
            this.direction.x,
            Math.abs(dif.yDifference),
            this.direction.y,
            this.speed
          );
          newPosition = triangeResult;
          // if x direction is null but not y, or vice versa, that means
          // it is moving in a line, not diagonal, so move accordingly
        } else if (this.direction.x === null) {
          newPosition.x = endPosition.x;
          let newY;
          if (this.direction.y === Direction.SOUTH) {
            newY = this.creature.position.y + this.speed;
            // if it's going to go past the end point,
            // set it to the end point
            if (newY > endPosition.y) {
              newY = endPosition.y;
            }
          } else {
            newY = this.creature.position.y - this.speed;
            // if it's going to go past the end point,
            // set it to the end point
            if (newY < endPosition.y) {
              newY = endPosition.y;
            }
          }
          newPosition.y = newY;
          // this will be similar logic as above, except for the
          // y directions instead of x
        } else if (this.direction.y === null) {
          newPosition.y = endPosition.y;
          let newX;
          if (this.direction.x === Direction.EAST) {
            newX = this.creature.position.x + this.speed;
            if (newX > endPosition.x) {
              newX = endPosition.x;
            }
          } else {
            newX = this.creature.position.x - this.speed;
            if (newX < endPosition.X) {
              newX = endPosition.x;
            }
          }
          newPosition.x = newX;
        }
    
        // TODO write logic in case creature cannot move diagonally
        // and can only move up or down, left or right
        let collisionResult = checkAllCreatureObjectCollisions(this.creature, newPosition, objects);

        //
    
        //TODO write logic to also avoid going over other creature's shelters - move around them

        //console.log(newPosition);
        //return newPosition;
        return {
          success: !collisionResult.didCollide,
          forPosition: newPosition,
          difference: dif,
          objectCollided: collisionResult.objectCollided,
          collisionSide: collisionResult.collisionSide
        };
    }

    setDirection = (xDifference, yDifference) => {
      //this.previousDirection = {...this.direction};

        this.direction.x = xDifference > 0 ? Direction.EAST : Direction.WEST;
        //this.direction.x = xDifference === 0 ? Direction.NONE : this.direction.x;
        if (Math.abs(xDifference) <= this.speed) {
            this.direction.x = null;
        }
        this.direction.y = yDifference > 0 ? Direction.SOUTH : Direction.NORTH;
        //this.direction.y = yDifference === 0 ? Direction.NONE : this.direction.y;
        if (Math.abs(yDifference) <= this.speed) {
            this.direction.y = null;
        }
    };

        // sight targeting methods

    checkForPredators = () => {

    }

    getSightCoordinates = (canvasInfo) => {
        let direction = null;
        // if there is a newDirection set, use that for determining which way to show the site coordinates
        if (this.newDirection) {
        direction = this.newDirection;
        }

        // otherwise, use direction. For now, use the direction that is furthest from target if there's two
        // this is for simplicity - in the future maybe make it diagonal too.
        if (!direction) {
        direction = determineSightDirection(this.creature);
        }

        // now get the coordinates and return them
        let coord = determineSightCoordinates(this.creature, direction, canvasInfo);
        //console.log(`sight coords: ${JSON.stringify(coord)}`);
        return coord;
    }
}