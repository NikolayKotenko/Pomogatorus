export default function CompareArrays(arrOne, arrTwo) {
   let result = false
   if (arrOne.length === arrTwo.length) {
      for (let i = 0; i < arrOne.length; i++) {
         result = arrTwo.indexOf(arrOne[i]) !== -1

         if (result === false) {
            break
         }
      }
   }
   return result
}
