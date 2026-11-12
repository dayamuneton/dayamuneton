export const validateFloatInput = (value: string) => {
   return /^[0-9]*[.,]?[0-9]*$/.test(value);
};
export const handleNumberInputChange = (
   e: React.ChangeEvent<HTMLInputElement>,
   setState: React.Dispatch<React.SetStateAction<string | number>>
) => {
   if (validateFloatInput(e.target.value)) {
      setState(e.target.value);
   }
};
