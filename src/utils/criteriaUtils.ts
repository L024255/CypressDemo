export const checkType = (criterionType: string, compareType: string) => {
  switch (criterionType) {
      case 'Include':
        return compareType === 'inclusion'
      case 'Exclude':
        return compareType === 'exclusion'
  }
  return false
};