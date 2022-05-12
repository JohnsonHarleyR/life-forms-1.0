import { ShelterLine } from "../../../constants/canvasConstants";
import { getStartAndEndPoints } from "../../universalLogic";
import { LifeStage } from "../../../constants/creatureConstants";

export default class Shelter {
    constructor(id, position, color, creatureSize) {
        this.id = id;
        this.position = position;
        this.color = color;
        this.size = creatureSize * ShelterLine.MULTIPLIER;

        this.inventory = {
            food: []
        };
        this.totalFoodEnergy = 0;

        this.members = [];
    }

    updateShelter = () => {
        // check that all the members are still part of this shelter
        this.updateMembers();

        // update Food Energy
        this.updateFoodEnergy();
    }

    updateFoodEnergy = () => {
        let total = 0;
        this.inventory.food.forEach(f => {
            total += f.energy;
        });
        this.totalFoodEnergy = total;
    }

    addMemberToShelter = (newMember) => {
        if (!this.isMemberOfShelter(newMember.id)) {
            this.members.push(newMember);
            newMember.safety.shelter = this;
        }
    }

    removeMemberFromShelter = (member) => {
        if (this.isMemberOfShelter(member.id)) {
            let newList = [];
            this.members.forEach(m => {
                if (m.id !== member.id) {
                    newList.push(m);
                }
            });
            this.members = newList;
            member.safety.shelter = null;
        }
    }

    updateMembers = () => {
        let newList = [];
        this.members.forEach(m => {
            if (m.safety.shelter !== null && 
                m.safety.shelter.id === this.id && 
                m.life.lifeStage !== LifeStage.DECEASED) {
                    newList.push(m);
                }
        });
        this.members = newList;
    }

    isMemberOfShelter = (creatureId) => {
        let result = false;
        this.members.forEach(m => {
            if (m.id === creatureId) {
                result = true;
            }
        } );
        return result;
    }

    getXStart = () => {
        let halfSize = this.size / 2;
        return this.position.x - halfSize;
    }

    getXEnd = () => {
        let halfSize = this.size / 2;
        return this.position.x + halfSize;
    }

    getYStart = () => {
        let halfSize = this.size / 2;
        return this.position.y - halfSize;
    }

    getYEnd = () => {
        let halfSize = this.size / 2;
        return this.position.y + halfSize;
    }
}