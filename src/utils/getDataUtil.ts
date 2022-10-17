import { ScenarioCriteriaModle } from "../pages/IE/Criteria/type/ScenarioCriteriaModel";

export const getUserNameFromContextById = (id: string, contextData: any) => {
  if (id && contextData && contextData.users) {
    const user = contextData.users.find((user: any) => user.id === id);
    if (user && user.name) {
      const result = user.name.split("-")[0];
      return result;
    }
  }
  return "";
};
export const formatUserName = (userName: string) => {
  return userName?.split("-")[0] || "";
};

export const formatTime = (timestring?: string) => {
  if (timestring) {
    const date = new Date(timestring);
    const timeString = date.toLocaleTimeString().replace(/:\d+ /, " ");
    const result = `${date.toDateString()} ${timeString}`;
    return result;
  }
  return "";
};

export const formatCriterionDisplayName = (criteria?: ScenarioCriteriaModle) => {
  let result = "";
  let quantMod = true;
  if (criteria) {
    if (criteria.min && criteria.max) {
      result = `${criteria.name} ${criteria.min}-${criteria.max}`;
    } else if (criteria.min) {
      result = `${criteria.name} ≥ ${criteria.min}`;
    } else if (criteria.max) {
      result = `${criteria.name} ≤ ${criteria.max}`;
    } else if (criteria.equal) {
      result = `${criteria.name} = ${criteria.equal}`;
    } else {
      result = `${criteria.name}`;
      quantMod = false;
    }
    if (criteria.unit) {
      result += ` ${criteria.unit}`;
    }
    if (criteria.tempModifier) {
      if (quantMod) {
        result += ';';
      }
      result += ` ${criteria.tempModifier}`;
    }
  }
  return result;
};


/**
 *
 * @param score  the score.
 * @param tertiles the teriles to idenfity ranks. length should be 2 or 3.
 * @param ranks : the ranks, define ranks by the sort from low to high of score.
 * @returns the rank of the score in tertiles.
 */
export const getRankByScore = (
  score: number,
  tertiles: number[],
  ranks: string[]
) => {
  let rank = "N/A";
  if (tertiles && tertiles.length > 0) {
    const [low, high] = tertiles;
    if (score < low) {
      rank = ranks[0];
    } else if (score >= low && score <= high) {
      rank = ranks[1];
    } else if (score > high) {
      rank = ranks[2];
    }
  }
  return rank;
};

export const checkIsFloat = (value: any) => {
  const floatRegx = /^[0-9._]+$/;
  return floatRegx.test(value);
}

/**
 * transfer base64 data to blob and download the csv file.
 * @param base64Data response base64data
 * @param contentType data type
 * @param filename download file name. default demo.csv
 */
export const getDownloadFileFromBase64Data = async (base64Data: string, contentType: string = "text/plain", filename: string = "demo.csv") => {
  const base64Response = await fetch(`data:${contentType};base64,${base64Data}`);
  const blob = await base64Response.blob()
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename); //or any other extension
  link.click();
}
