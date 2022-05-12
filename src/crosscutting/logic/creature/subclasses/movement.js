import { LifeStage, ActionType, NeedType } from "../../../constants/creatureConstants";
import { Direction } from "../../../constants/creatureConstants";
import { determineSightCoordinates,
    getRandomShelterPosition,
    determineSightDirection,
    getRandomCreatureStartPosition,
    getPositionInNewDirection,
    checkSightAreaForItemInArray,
    canSetShelterInPosition} from "../creatureLogic";
import { MoveMode } from "../../../constants/creatureConstants";
import { CanvasInfo } from "../../../constants/canvasConstants";
import { ShelterLine } from "../../../constants/canvasConstants";
import { FoodType } from "../../../constants/objectConstants";
import { isInPosition, getPositionDifference, getTriangleMovePosition,
    getRandomStartPosition, addItemToArray } from "../../universalLogic";
import { checkAllCreatureObjectCollisions, 
  determineDirectionByTarget } from "../../object/objectsLogic";
import Shelter from "./shelter";

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
    }

    updateMovement = (objects, plants, creatures, shelters, CanvasInfo) => {
        
        // if previous priority is different than new priority, set mode to think mode
        if (this.creature.needs.previousPriority === null || 
            this.creature.needs.previousPriority !== this.creature.needs.priority || 
            this.creature.needs.prioriityComplete) {
                this.moveMode = MoveMode.THINK;
                this.resetMovementProperties(); // keey?
        }

        // if creature is thinking, determine move mode based on priority
        if (this.moveMode === MoveMode.THINK) {
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
            this.moveMode === MoveMode.NONE || this.moveMode === MoveMode.STAND_STILL) {
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
              //this.targetPosition = this.position;
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
          }

        this.creature.position = newPosition;

        //console.log(`${this.creature.id} end: ${JSON.stringify(newPosition)}`);
    }

    determineModeByPriority = () => {
        switch(this.creature.needs.priority) {
            default:
            case ActionType.NONE:
                this.searchNeed = NeedType.NONE;
                this.resetMovementProperties();
                this.moveMode = MoveMode.STAND_STILL;
                break;
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
            case ActionType.FEED_SELF:
                this.creature.targetType = NeedType.FOOD;
                this.moveMode = MoveMode.SEARCH;
                break;

        }
    }

    getInitialTargetPosition = (objects, creatures, plants, shelters) => {
        switch(this.creature.needs.priority) {
            default:
            case ActionType.NONE:
                return this.creature.targetPosition; // temp
            case ActionType.CREATE_SHELTER:
                return getRandomShelterPosition(this.creature, creatures, objects, shelters);
            case ActionType.FEED_SELF:
                return this.creature.targetPosition; // temp

        }
    }

    searchForTarget = (plants, creatures, objects, shelters, canvasInfo) => {

        // FIRST see if there are other things needed to be searched for besides food
        // A shelter should be the first thing to find!
        if (this.creature.targetType === NeedType.SHELTER) {
            
            
        } else if (this.creature.targetType === NeedType.FOOD) {
        }
    
        let newPosition = this.creature.position;
    
    
        // first what to do if simply searching for food
        if (this.targetType === FoodType.BOTH || this.targetType === FoodType.PREY || 
          this.targetType === FoodType.PLANT) {
        
        // otherwise, what to do if searching for shelter
        } else if (this.creature.targetType === NeedType.SHELTER) {
            newPosition = this.searchForShelter(plants, creatures, objects, shelters, canvasInfo);
        }
    
    
        
    
        return newPosition;
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
          if (!canSetShelterInPosition(this.creature.targetPosition, this.creature.adultSize, creatures, objects, shelters)) {
            this.creature.targetPosition = getRandomShelterPosition(this.creature, creatures, objects, shelters);
          } else {
            let newShelter = new Shelter(this.creature.position, this.creature.color, this.creature.size);
            newShelter.addMemberToShelter(this.creature);
            addItemToArray(newShelter, shelters, this.creature.setShelters);
          }

        }
    
        // return new position
        return newPosition;
    }

    moveToPoint = (endPosition, objects, creatures, shelters, canvasInfo) => {
        let newPosition = this.creature.position;

        let result = this.moveTowardPosition(endPosition, objects, canvasInfo);
        if (result.success) {
            newPosition = result.forPosition;
            //this.finishedFirstDirection = false;
            // // reset avoid object variables if they need to be reset
            if (this.newDirection) {
              console.log(`Going in new direction around object`);
              this.newDirection = null;
              this.previousSide = null;
            }
      
          } else {
            console.log(`object collision at point ${JSON.stringify(result.forPosition)}. Moving around object.`);
            this.objectCollided = result.objectCollided;
            newPosition = this.moveAroundObject(
              result.objectCollided,
              result.collisionSide,
              canvasInfo
            );
          }

        return newPosition;
    }

    moveToRandomPosition = (objects, canvasInfo) => {
        console.log('moveToRandomPosition');
    }

    moveAroundObject = (obj, collisionSide, canvasInfo) => {
      console.log(`Collision side: ${collisionSide}`);
      this.sideOfCollision = collisionSide;
      if (this.newDirection === null || this.previousSide !== collisionSide) {
        this.newDirection = determineDirectionByTarget(this.creature, this.sideOfCollision, obj, canvasInfo);
      console.log(`new direction: ${this.newDirection}`);
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
        this.direction.x = xDifference > 0 ? Direction.EAST : Direction.WEST;
        if (Math.abs(xDifference) <= this.speed) {
            this.direction.x = null;
        }
        this.direction.y = yDifference > 0 ? Direction.SOUTH : Direction.NORTH;
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