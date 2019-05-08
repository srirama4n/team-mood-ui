import { Injectable } from '@angular/core';
import { AgWordCloudData } from 'angular4-word-cloud';
import { ITemparature } from './model';
export class WordCloudUtility {
    wordData: Array<AgWordCloudData>;
    duplicatePresent: boolean = false;
    updatedTemperatures: ITemparature[];
    newArray: ITemparature[];
    renderWordCloud(temperatures: ITemparature[]): any {
        this.wordData = [];
        if (temperatures.length > 0) {
            this.countNumberOfDuplicates(temperatures);
            let tempArray: ITemparature[] = this.removeDuplicates(this.updatedTemperatures);
            let highestElement: number = this.indexOfMax(tempArray);
            let i: number = 0;
            for (i = 0; i < tempArray.length; i++) {
                if (this.duplicatePresent && i === highestElement) {
                    const color = tempArray[i].averageRating <= 5 ? '#ff0000' : '#008000';
                    this.wordData.push({ text: tempArray[i].comment, size: 11, color: color });
                }
                else {
                    this.wordData.push({ text: tempArray[i].comment, size: tempArray[i].rating });
                }
            }
        }
        return this.wordData;
    }
    countNumberOfDuplicates(temperatures: ITemparature[]) {
        let i: number = 0;
        let j: number = 0;
        let count: number = 1;
        let rating: number = 0;
        this.updatedTemperatures = [];
        for (i = 0; i < temperatures.length; i++) {
            for (j = 0; j < temperatures.length; j++) {
                if (j != i && (temperatures[i].comment).toLowerCase() === (temperatures[j].comment).toLowerCase()) {
                    count = count + 1;
                    if (rating === 0) {
                        rating = temperatures[i].rating + temperatures[j].rating;
                    }
                    else {
                        rating = rating + temperatures[j].rating;
                    }
                }
                else {
                    temperatures[i].count = count;
                    if (count > 1) {
                        temperatures[i].averageRating = rating / count;
                    }
                    this.updatedTemperatures.push(temperatures[i]);
                    count = 1;
                    rating = 0;
                }
            }
        }
    }
    //Removing duplicates from the array
    private removeDuplicates(originalArray: ITemparature[]): ITemparature[] {
        let lookupObject: ITemparature = {};
        this.newArray = [];
        for (var i in originalArray) {
            lookupObject[originalArray[i]['comment'].toLowerCase().trim()] = originalArray[i];
        }

        for (i in lookupObject) {
            this.newArray.push(lookupObject[i]);
        }
        return this.newArray;
    }
    //Return index of mximum element in the array
    private indexOfMax(arr: ITemparature[]): number {
        if (arr.length === 0) {
            return -1;
        }
        let max: number = arr[0].count;
        let maxIndex: number = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i].count > max) {
                maxIndex = i;
                max = arr[i].count;
            }
        }
        if (max > 1) {
            this.duplicatePresent = true;
        }
        return maxIndex;
    }
}
