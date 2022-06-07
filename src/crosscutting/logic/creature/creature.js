import { FoodType } from "../../constants/objectConstants";
import { MoveMode,
        Direction,
        LifeStage,
        CreatureDefaults,
        AmountNeeded,
        Gender,
        ActionType,
        NeedType } from "../../constants/creatureConstants";
import CreatureNeeds from "./subclasses/needs";
import CreatureSafety from "./subclasses/safety";
import CreatureLife from "./subclasses/life";
import CreatureMovement from "./subclasses/movement";
import CreatureMating from "./subclasses/mating";
import { 
    determineSightDirection,
    determineSightCoordinates,
} from "./creatureLogic";
import { roundToPlace, millisecondsToMinutes, blendColors } from "../universalLogic";
import Emojis from "./subclasses/emojis/emojis";
import { getFoodTargetType } from "./subclasses/logic/safetyLogic";

export default class Creature {
    constructor({id, size, color, gender, type, lifeSpanRange, lifeStage, fractionAsChild, fractionAsElder, foodToGatherAtOnce,
        food, energy, sightRadius, sightDistance, position, speed, foodNeeded, sleepNeeded, matingNeeded,
        genderOfProvider, genderOfCaregiver, genderOfShelterMaker, pregnancyTerm, minOffspring, maxOffspring,
        mother, father, targetPosition, setPlants, setCreatures, setShelters }) {

        // do not touch the stuff in the next paragraph - as in don't refactor
        this.id = id;
        this.type = type;
        this.adultSize = size;
        this.adultEnergy = energy;
        this.adultColor = color;
        this.gender = gender;
        this.life = new CreatureLife(this, lifeSpanRange, lifeStage, fractionAsChild, fractionAsElder);
        this.energy = this.life.determineEnergy();
        this.isEaten = false;
        this.size = this.life.determineSize();
        this.width = this.size; // Necessary?
        this.height = this.size; // Necessary?
        this.color = this.life.determineColor();
        this.foodType = FoodType.PREY; // this will always be prey - it helps a predator determine if it's food or not - this is included in plants too
        this.foodTargetType = getFoodTargetType(food);

        this.safety = new CreatureSafety(this, null, false); // shelter and isBeingChased
        this.family = {
            mate: null,
            children: [],
            mother: mother,
            father: father
        };
        this.mating = new CreatureMating(this, genderOfProvider, genderOfCaregiver, genderOfShelterMaker, pregnancyTerm, minOffspring, maxOffspring);
    
        this.food = food; // what types of food does the creature eat? Two categories: plants and prey, both arrays

        this.inventory = {
            food: [],
            foodToGatherAtOnce: foodToGatherAtOnce
        };

        this.needs = new CreatureNeeds(this, foodNeeded, sleepNeeded, matingNeeded);

        this.targetType = FoodType.BOTH;
        this.currentTarget = null;
        this.targetPosition = targetPosition;

        this.position = position;
        this.movement = new CreatureMovement(this, sightRadius, sightDistance, speed);
    
        
        this.showLines = true;
        this.emojis = new Emojis(this);
    
        this.setPlants = setPlants;
        this.setCreatures = setCreatures;
        this.setShelters = setShelters;
    }

    returnProperties = () => {
        return {
            color: this.color,
            size: this.size,
            width: this.width,
            height: this.height,
            energy: this.energy, // TODO consider decreasing energy amount for children, seniors, dead, etc. (Maybe have option to be vulture type? add that stuff later... as enhancements)
            life: this.life,
            safety: this.safety,
            family: this.family,
            mating: this.mating,
            needs: this.needs,
            food: this.food,
            targetType: this.targetType,
            currentTarget: this.currentTarget,
            targetPosition: this.targetPosition,
            inventory: this.inventory,
            position: this.position,
            movement: this.movement
        };
    }

    update = (objects, plants, creatures, shelters, CanvasInfo) => {
        // do other update stuff
        this.life.updateLife();
        //TODO check for predators in view
        this.safety.updateSafety(creatures);
        this.mating.updateMating();
        this.needs.updateNeeds(creatures);
        this.movement.updateMovement(objects, plants, creatures, shelters, CanvasInfo);
        //this.movement.move(this, objects, plants, creatures, CanvasInfo); // act

        return this.returnProperties();
    }


}
