/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useParams, useLocation } from "react-router";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {
  Grid,
  FormControl,
  FormLabel,
  Typography,
  styled,
  TextField,
  Button,
  Chip,
  Link,
  Divider,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Autocomplete, createFilterOptions, AutocompleteChangeReason } from "@material-ui/lab";
import * as yup from "yup";
import { useFormik } from "formik";
import { fetchByGraphqlString, graphqlStringMap } from "../../api/fetchByTypes";
import AppBreadcrumb from "../../components/AppBreadcrumb";
import SearchTool from "./components/SearchTool";
import FormSelect from "../../components/CustomSelect";
import UsersContext from "../../provider/UsersContextProvider";
import AlertDialog from "./components/AlertDialog";
import {
  TrialWorkspaceInputType,
  useCreateWorkspace,
} from "../../hooks/useCreateWorkspace";
import {
  CreateScenarioInputType,
  useCreateScenario,
} from "../../hooks/useCreateScenario";
import CustomLoading from "../../components/CustomLoading/CustomLoading";
import { QueryByStringWithClient } from "../../api/apollo";
import InputMask from "react-input-mask";
import { useJwtInfo } from "../../hooks/JwtInfo";
import { reject, sortBy } from "lodash";
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

interface NewTrialDetailProps { }
interface AttrubutesProps {
  id: string;
  name: string;
  inputValue?: string;
  isAddAction?: boolean;
}

const NewTrialDetail: React.FC<NewTrialDetailProps> = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const contextData = useContext<any>(UsersContext);
  const attributes = {
    therapeuticArea: {
      title: "THERAPEUTIC AREA",
      value: "",
    },
    indication: {
      title: "INDICATION",
      value: "",
    },
    studyPhase: {
      title: "STUDY PHASE",
      value: "",
    },
    studyType: {
      title: "STUDY TYPE",
      value: "",
    },
    trialTitle: {
      title: "TRIAL TITLE",
      value: "",
    },
    pediatricStudy: {
      title: "PEDIATRIC STUDY",
      value: "",
    },
    molecule: {
      title: "MOLECULE",
      value: "",
    },
  };
  const { jwtInfo } = useJwtInfo();
  const [trialWorkspaceList, setTrialWorkspaceList] = useState<any[]>([]);
  const [studyPhases, setStudyPhases] = useState<AttrubutesProps[]>([]);
  const [studyTypes, setStudyTypes] = useState<AttrubutesProps[]>([]);
  const [indications, setIndications] = useState<AttrubutesProps[]>([]);
  const [theraPeuticAreas, setTheraPeuticAreas] = useState<AttrubutesProps[]>(
    []
  );
  const [molecules, setMolecules] = useState<AttrubutesProps[]>([]);
  const [trialId, setTrialId] = useState("");
  const [showWarningMessage, setShowWarningMessage] = useState<Boolean>(false)

  const collaborators: any =
    reject(contextData?.users, function (o) {
      return o.username === jwtInfo?.preferred_username;
    }) || [];

  const newScenarioBreadcrumbLinks = [
    { href: "/", text: "" },
    { href: "/trial-homepage/" + trialId, text: "Trial Homepage" },
    {
      text: "New Scenario For Existing Trial",
      currentPage: true,
    },
  ];
  const newTrialWorkspaceBreadcrumbLinks = [
    { href: "/", text: "" },
    { href: "/create-new", text: "Create New" },
    {
      href: "/new-trial-detail/workspace",
      text: "New Trial Workspace",
    },
  ];
  const newTrialTitle = "New Trial Workspace Details";
  const newTrialDescription =
    "Create a new trial workspace for your trial by entering a few characteristics below. If the trial workspace already exists within SD DIO, you will receive an error alert message.";
  const newScenarioTitle = " New Scenario Details";
  const newScenarioDescription =
    "Create a scenario for a new or existing trial workspace. Search for an existing trial in SD DIO by alias, or input a few trial characteristics to create a new trial workspace.";
  const searchToolFieldTitle = "Search for Existing Trial by Trial Alias*";
  const indicationWarningMessage = "The Indication selected is not supported for all SD DIO features such as I/E criteria or historical SoA frequencies"

  const workspaceValidateSchema = yup.object().shape({
    trialTitle: yup
      .string()
      .required("Trial Title is required")
      .max(80, "The max length of title is 80."),
    therapeuticArea: yup
      .string()
      .required("Therapeutic Area is required"),
    indication: yup.array()
      .required("Indication is required")
      .length(1, "Indication is required"),
    trialAlias: yup
      .string()
      .required("Trial Alias is required")
      .matches(
        /([a-zA-Z0-9]{3})+-([a-zA-Z0-9]{2})+-([a-zA-Z0-9]{4})/gm,
        "Trial Alias Format Should be XXX-XX-XXXX"
      ),
    trialDescription: yup
      .string()
      .max(250, "You've entered more than 250 characters"
      ),
    duration: yup.number()
      .typeError('Duration must be a number')
      .min(1, 'Duration must be greater than 0')
  });
  const initialWorkspaceFormValues: { [x: string]: any } = {
    trialTitle: "",
    trialAlias: "",
    trialDescription: "",
    therapeuticArea: "",
    studyphase: studyPhases?.length > 0 ? studyPhases[0].id : undefined,
    studytype: studyTypes?.length > 0 ? studyTypes[0].id : undefined,
    // duration: ,
    collaborators: [],
    indication: [],
    pediatricStudy: "",
    molecule: undefined,
  };
  const newScenarioValidateSchema = yup.object().shape({
    trialWorkspaceId: yup.string().required("Please select a Trial"),
    scenarioName: yup.string().required("Scenario Name is required"),
  });
  const initialNewScenarioFormValues = {
    trialWorkspaceId: "",
    scenarioName: "",
    scenarioDescription: "",
  };
  const { push } = useHistory();
  const { createNewTrial } = useCreateWorkspace();
  const { createNewScenario } = useCreateScenario();
  const { type }: any = useParams();
  const [detailType, setDetailType] = useState("workspace");
  const [loading, setLoading] = useState(false);
  const [isClickSubmit, setIsClickSubmit] = useState(false);
  const [openDialog, setOpenDialog] = useState({
    isOpen: false,
    title: "A trial is already created",
    content:
      "It looks like you already have a trial workspace established for this trial based on the trial alias. Would you like to create a new scenario for this existing trial workspace?",
  });
  const [systemError, setSystemError] = useState<any>("");
  const [searchValue, setSearchValue] = useState<any[]>([]);
  const [
    searchResultTrialAttributes,
    setSearchResultTrialAttributes,
  ] = useState(attributes);

  const fetchTrialByAlias = (trialAlias: string) => {
    return QueryByStringWithClient(
      graphqlStringMap.fetchAllTrialWorkspaceList,
      {
        input: {
          userTrial: { trialAlias },
        },
      }
    );
  };
  const supportMapping: any = {
    "Alzheimer's Disease": ['CNS'],
    "Type 2 Diabetes": ['Endocrinology'],
    "Obesity": ['Endocrinology'],
    "NAFLD": ['Endocrinology']
  };
  const workspaceFormike = useFormik({
    initialValues: initialWorkspaceFormValues,
    validationSchema: workspaceValidateSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      const {
        trialTitle,
        trialDescription,
        trialAlias,
        indication,
        studytype,
        studyphase,
        therapeuticArea,
        pediatricStudy,
        duration,
        molecule,
        moleculeName,
        collaborators,
      } = values;
      const durationValue = duration !== undefined ? parseInt(duration) : duration;
      const moleculeId = molecule ? molecule : undefined;
      const params: TrialWorkspaceInputType = {
        input: {
          userTrial: {
            trialTitle,
            trialDescription,
            trialAlias: trialAlias?.toUpperCase(),
            therapeuticAreaId: therapeuticArea || undefined,
            studyTypeId: studytype || undefined,
            phaseId: studyphase || undefined,
            indicationId: indication.toString() || undefined,
            pediatricStudy: pediatricStudy === "Yes",
            moleculeId: moleculeName ? undefined : moleculeId,
            moleculeName,
            duration: durationValue,
            unsupported: false
          },
          users: collaborators,
        },
      };

      // If user ads indication manually remove indicationId and add otherIndication
      const existingIndication = indications.find(i => i.id === indication.toString())
      if(!existingIndication) {
        params.input.userTrial = {
          ...params.input.userTrial,
          otherIndication: indication.toString() || undefined,
          unsupported: true
        }

        delete params.input.userTrial.indicationId
      } else {
        const taName = theraPeuticAreas.find((ta) => ta.id === therapeuticArea);
        const supported = supportMapping[existingIndication.name].find((ta: string) => ta === taName?.name);

        if (!supported) {
          params.input.userTrial = {
            ...params.input.userTrial,
            unsupported: true,
          }
        }
      }

      fetchTrialByAlias(trialAlias?.toUpperCase())
        .then((res: any) => {
          if (
            res.data.allTrialWorkspaces &&
            res.data.allTrialWorkspaces.length > 0
          ) {
            const trial = res.data.allTrialWorkspaces.find(
              (trial: any) =>
                trial.userTrial?.trialAlias === trialAlias.toUpperCase()
            );
            const error = (
              <>
                Trial already exists! Would you like to{" "}
                <Link href={`/trial-homepage/${trial.id}`}>
                  view the existing trial workspace
                </Link>
              </>
            );
            setSystemError(error);
          } else {
            createNewTrial(params)
              .then((res: any) => {
                const trialId = res?.data?.createTrialWorkspace?.id;
                if (trialId) {
                  push(`/trial-homepage/${trialId}`);
                }
              })
              .catch((error: any) => {
                console.log(error);
                setSystemError("There was an error, please try again");
              });
          }
        })
        .catch((error: any) => {
          setSystemError("There was an error, please try again");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });
  const newScenarioFormike = useFormik({
    initialValues: initialNewScenarioFormValues,
    validationSchema: newScenarioValidateSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const { trialWorkspaceId, scenarioName, scenarioDescription } = values;
      setLoading(true);
      const params: CreateScenarioInputType = {
        input: {
          trialWorkspaceId,
          name: scenarioName,
          description: scenarioDescription,
        },
      };
      createNewScenario(params)
        .then((res: any) => {
          push(`/trial-homepage/${trialWorkspaceId}`);
        })
        .catch((error: any) => {
          console.log(error);
          setSystemError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    setDetailType(type);
    if (type === "workspace") {
      fetchByGraphqlString(graphqlStringMap.fetchAllDictionaries)
        .then((res: any) => {
          const phases = res.data?.phases || [];
          const studyTypes = res.data?.studyTypes || [];
          const indications = res.data?.indications.filter(
            (indication: any) => indication.userDefined === false
          ) || [];
          const therapeuticAreasDic = res.data?.therapeuticAreas || [];
          const molecules = res.data?.molecules || [];
          setStudyPhases(phases);
          setStudyTypes(studyTypes);
          setIndications(indications);
          setTheraPeuticAreas(therapeuticAreasDic);
          setMolecules(molecules);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [type]);

  useEffect(() => {
    const workspaceId = query.get("workspaceId");
    setLoading(true);
    fetchByGraphqlString(graphqlStringMap.fetchMyTrialWorkspaceList)
      .then((res: any) => {
        const trialWorkspacesList = res?.data?.myTrialWorkspaces || [];
        setTrialWorkspaceList(trialWorkspacesList);
      })
      .catch((error: any) => {
        setSystemError(error.message);
      })
    fetchByGraphqlString(graphqlStringMap.fetchTrailWorkspaceList)
      .then((res: any) => {
        const trialWorkspacesList = res?.data?.trialWorkspaces || [];
        if (workspaceId) {
          setTrialId(workspaceId);
          const searchedWorkspace = trialWorkspacesList.find(
            (workspace: any) => {
              return workspace.id === workspaceId;
            }
          );
          if (searchedWorkspace) {
            setSearchValue([searchedWorkspace.userTrial.trialAlias]);
            setTrialworkspaceInfo(searchedWorkspace);
          } else {
            setSystemError("Trail workspace not found.");
            setSearchResultTrialAttributes(attributes);
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
        setSystemError(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const workspaceFormErrors = Object.values(workspaceFormike.errors);
    const workspaceFormTouched = Object.values(workspaceFormike.touched);
    const newScenarioFormErrors = Object.values(newScenarioFormike.errors);
    const newScenarioFormTouched = Object.values(newScenarioFormike.touched);
    if (
      ((workspaceFormErrors.length > 0 && workspaceFormTouched.length > 0) ||
        (newScenarioFormErrors.length > 0 &&
          newScenarioFormTouched.length > 0)) &&
      isClickSubmit
    ) {
      setSystemError(
        "This page has detected errors. Please resolve all errors before submitting."
      );
      setIsClickSubmit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    workspaceFormike.touched,
    workspaceFormike.errors,
    newScenarioFormike.touched,
    newScenarioFormike.errors,
  ]);

  const getCollaboratorsByIdArr = (idArr: string[]) => {
    const result: any[] = [];
    idArr.forEach((id: string) => {
      const index = contextData?.users.findIndex((user: any) => user.id === id);
      if (index > -1) {
        result.push(contextData?.users[index]);
      }
    });
    return result;
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<{}>,
    value: any[],
    reason: AutocompleteChangeReason
  ) => {
    const newValue = value.length > 0 ? value.splice(value.length - 1) : [];
    setSearchValue(newValue);
    if (newValue.length > 0) {
      setLoading(true);
      fetchByGraphqlString(graphqlStringMap.fetchTrailWorkspaceList)
        .then((res: any) => {
          const trialWorkspacesList = res?.data?.trialWorkspaces || [];
          const searchedWorkspace = trialWorkspacesList.find(
            (workspace: any) => {
              return workspace.userTrial.trialAlias === newValue[0];
            }
          );
          if (searchedWorkspace) {
            setTrialworkspaceInfo(searchedWorkspace);
          } else {
            setSystemError("Trail workspace not found.");
            setSearchResultTrialAttributes(attributes);
          }
        })
        .catch((error: any) => {
          console.log(error);
          setSystemError("Network Error!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const setTrialworkspaceInfo = (searchedWorkspace: any) => {
    const trialAttributes = { ...searchResultTrialAttributes };
    const userTrial = searchedWorkspace.userTrial;
    trialAttributes.trialTitle.value = userTrial.trialTitle;
    trialAttributes.indication.value = userTrial.indication?.name;
    trialAttributes.molecule.value = userTrial.molecule?.name;
    trialAttributes.pediatricStudy.value = userTrial.pediatricStudy
      ? "yes"
      : "no";
    trialAttributes.studyPhase.value = userTrial.phase?.name;
    trialAttributes.studyType.value = userTrial.studyType?.name;
    trialAttributes.therapeuticArea.value = userTrial.therapeuticArea?.name;
    const workspaceId = searchedWorkspace.id;
    setSearchResultTrialAttributes(trialAttributes);
    newScenarioFormike.setFieldValue("trialWorkspaceId", workspaceId, true);
  };
  const handleCloseErrorTip = () => {
    setSystemError("");
  };
  const filter = createFilterOptions<AttrubutesProps>();
  const renderNewTrialWorkspaceInputs = () => {
    // const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return (
      <>
        <FormRow>
          <FormControl component="fieldset" style={{ width: "100%" }}>
            <FormLabel component="legend">
              <FieldTitle>TRIAL TITLE*</FieldTitle>
            </FormLabel>
            <Input
              error={
                workspaceFormike.touched.trialTitle &&
                Boolean(workspaceFormike.errors.trialTitle)
              }
              helperText={
                workspaceFormike.touched.trialTitle &&
                workspaceFormike.errors.trialTitle
              }
              variant="outlined"
              id="trialTitle"
              name="trialTitle"
              value={workspaceFormike.values.trialTitle}
              onChange={workspaceFormike.handleChange}
            />
          </FormControl>
        </FormRow>
        <FormRow>
          <FormControl component="fieldset" style={{ width: "100%" }}>
            <FormLabel component="legend">
              <FieldTitle>TRIAL NOTES/DESCRIPTION</FieldTitle>
            </FormLabel>
            <Input
              multiline
              variant="outlined"
              id="trialDescription"
              name="trialDescription"
              label=""
              error={
                workspaceFormike.touched.trialDescription &&
                Boolean(workspaceFormike.errors.trialDescription)
              }
              helperText={
                workspaceFormike.touched.trialDescription &&
                workspaceFormike.errors.trialDescription
              }
              value={workspaceFormike.values.trialDescription}
              onChange={workspaceFormike.handleChange}
            />
          </FormControl>
        </FormRow>
        
        <FormRow container spacing={3}>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>THERAPEUTIC AREA</FieldTitle>
              </FormLabel>
              <FormSelect
                id="therapeuticArea"
                variant="outlined"
                labelId="new-trial-detail-therapeutic-area"
                disableunderline="true"
                native
                value={workspaceFormike.values.therapeuticArea}
                onChange={(e: any) => {
                  workspaceFormike.handleChange(e)
                  const taValue = e?.target?.value
                  const selectedIndication = workspaceFormike.values?.indication
                  const ta = theraPeuticAreas.filter(ta => ta.id === taValue)
                  const hasIndication = indications.find((indication) => indication.id === selectedIndication[0]);

                  if(ta.length > 0 && selectedIndication.length > 0) {
                    if(hasIndication && (ta[0].name === "Endocrinology" || ta[0].name === "CNS")) setShowWarningMessage(false)
                    else setShowWarningMessage(true)
                  }
                }}
                error={
                  workspaceFormike.touched.therapeuticArea &&
                  Boolean(workspaceFormike.errors.therapeuticArea)
                }
                helperText={
                  workspaceFormike.touched.therapeuticArea &&
                  workspaceFormike.errors.therapeuticArea
                }
              >
                <option key="option" value="">Select one option</option>
                {theraPeuticAreas?.map((therapeuticArea: AttrubutesProps) => (
                  <option key={therapeuticArea.id} value={therapeuticArea.id}>
                    {therapeuticArea.name}
                  </option>
                ))}
              </FormSelect>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <SearchTool
              tagSearchBarId="indication"
              tagSearchBarOptions={indications.map(
                (indication) => indication.name
              )}
              fieldTitle="INDICATION*"
              searchValue={workspaceFormike.values.indication.map(
                (value: any) =>
                  indications.find((indication) => indication.id === value)
                    ?.name || value
              )}
              error={
                workspaceFormike.touched.indication &&
                Boolean(workspaceFormike.errors.indication)
              }
              helperText={workspaceFormike.touched.indication ? workspaceFormike.errors.indication?.toString() : ""}
              onChange={(event, value, reason) => {
                let isaValidTA: Boolean
                const ta = theraPeuticAreas.filter(ta => ta.id === workspaceFormike.values.therapeuticArea)
                const result =
                  value?.map((v) => {
                    const obj = indications.find(
                      (indication) => value.length > 0 && indication.name === v
                    );

                    if(ta.length > 0) {
                      if(ta[0].name === "Endocrinology" || ta[0].name === "CNS") {
                        isaValidTA = true
                        setShowWarningMessage(false)
                      }
                      else {
                        isaValidTA = false
                        setShowWarningMessage(true)
                      }
                    }

                    !obj ? setShowWarningMessage(true) : (isaValidTA && setShowWarningMessage(false))
                    return obj?.id || value.length > 0 && v;
                  }) || [];

                workspaceFormike.setFieldValue("indication", result);
              }}
              onBlur={(event: any) => {
                let value = event.target?.value
                value && workspaceFormike.setFieldValue("indication", [...workspaceFormike.values.indication, value]);
                value && setShowWarningMessage(true)
              }}
            />
            {showWarningMessage && <WarningMessage>{indicationWarningMessage}</WarningMessage>}
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>MOLECULE</FieldTitle>
              </FormLabel>
              <MoleculeList
                id="molecule"
                freeSolo
                value={workspaceFormike.values.moleculeName}
                options={molecules}
                getOptionLabel={(molecule: any) => {
                  // Value selected with enter, right from the input
                  if (typeof molecule === 'string') {
                    const index = molecules?.findIndex((mole: any) => mole.id === molecule);
                    if (molecules && index && index > -1) {
                      return molecules[index]?.name || "";
                    }
                    return molecule;
                  }
                  // Add "xxx" option created dynamically
                  if (molecule.inputValue) {
                    return molecule.inputValue;
                  }
                  // Regular option
                  return molecule.name;
                }}

                renderOption={(molecule: any) => {
                  //TODO
                  // if (molecule.isAddAction) {
                  //   return <>
                  //   <span>{molecule.name}</span>
                  //   <Button>Add</Button>
                  //   </>
                  // }
                  return <span>{molecule.name}</span>;
                }}

                onChange={(event: any, newValue: any) => {
                  if (newValue !== null) {
                    if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      workspaceFormike.setFieldValue("molecule", newValue.inputValue);
                      workspaceFormike.setFieldValue("moleculeName", newValue.inputValue);

                    } else {
                      workspaceFormike.setFieldValue("molecule", newValue.id);
                    }
                  } else {
                    // when user hits the X to erase a value
                    workspaceFormike.setFieldValue("molecule", "");
                  }
                }}
                filterOptions={(options: any, params: any) => {
                  const filtered = filter(options, params);

                  // Suggest the creation of a new value
                  if (params.inputValue !== '') {
                    filtered.push({
                      inputValue: params.inputValue,
                      name: `Add "${params.inputValue}"`,
                      // name: params.inputValue,
                      id: params.inputValue,
                      // isAddAction: true,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys

                // onChange={workspaceFormike.handleChange}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    label=""
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
        </FormRow>
        <RowDivider>
          <FieldTitle>OTHER TRIAL DETAILS</FieldTitle>
          <Divider />
        </RowDivider>
        <FormRow container spacing={3} style={{ marginBottom: "10px" }}>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>STUDY PHASE</FieldTitle>
              </FormLabel>
              <FormSelect
                id="studyphase"
                variant="outlined"
                labelId="new-trial-detail-study-phase"
                disableunderline="true"
                native
                value={workspaceFormike.values.studyphase}
                onChange={workspaceFormike.handleChange}
              >
                {studyPhases?.map((phase: { id: string; name: string }) => (
                  <option key={phase.id} value={phase.id}>{phase.name}</option>
                ))}
              </FormSelect>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>STUDY TYPE</FieldTitle>
              </FormLabel>
              <FormSelect
                id="studytype"
                name="studytype"
                variant="outlined"
                labelId="new-trial-detail-study-type"
                disableunderline="true"
                native
                value={workspaceFormike.values.studytype}
                onChange={workspaceFormike.handleChange}
              >
                {studyTypes?.map((studyType: AttrubutesProps) => (
                  <option key={studyType.id} value={studyType.id}>{studyType.name}</option>
                ))}
              </FormSelect>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>DURATION</FieldTitle>
              </FormLabel>
              <Input
                id="duration"
                name="duration"
                variant="outlined"
                value={workspaceFormike.values.duration}
                onChange={workspaceFormike.handleChange}

                InputProps={{
                  endAdornment: <InputAdornment position="end">Month(s)</InputAdornment>,
                }}

                error={
                  workspaceFormike.touched.duration &&
                  Boolean(workspaceFormike.errors.duration)
                }
                helperText={
                  workspaceFormike.touched.duration &&
                  workspaceFormike.errors.duration
                }
              />

            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>TRIAL ALIAS*</FieldTitle>
              </FormLabel>
              <InputMask
                mask="***-**-****"
                value={workspaceFormike.values.trialAlias?.toUpperCase()}
                onChange={workspaceFormike.handleChange}
                onBlur={() => { }}
                disabled={false}
              >
                {() => (
                  <Input
                    variant="outlined"
                    id="trialAlias"
                    name="trialAlias"
                    error={
                      workspaceFormike.touched.trialAlias &&
                      Boolean(workspaceFormike.errors.trialAlias)
                    }
                    helperText={
                      workspaceFormike.touched.trialAlias &&
                      workspaceFormike.errors.trialAlias
                    }
                    label=""
                  />
                )}
              </InputMask>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset" style={{ width: "100%" }}>
              <FormLabel component="legend">
                <FieldTitle>PEDIATRIC STUDY</FieldTitle>
              </FormLabel>
              <FormSelect
                id="pediatricStudy"
                name="pediatricStudy"
                variant="outlined"
                labelId="new-trial-detail-pediatric-study"
                disableunderline="true"
                native
                value={workspaceFormike.values.pediatricStudy}
                onChange={workspaceFormike.handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </FormSelect>
            </FormControl>
          </Grid>
        </FormRow>
        <FormRow>
          <FormControl component="fieldset" style={{ width: "100%" }}>
            <FormLabel component="legend">
              <FieldTitle>COLLABORATORS</FieldTitle>
            </FormLabel>
            <Autocomplete
              multiple
              id="collaborators"
              options={sortBy(collaborators, o => o.name)}
              getOptionLabel={(option: any) => option.name}
              style={{ height: "44px" }}
              freeSolo
              value={getCollaboratorsByIdArr(
                workspaceFormike.values.collaborators
              )}
              onChange={(event, value, reason) => {
                const values = value.map((option) => option.id);
                workspaceFormike.setFieldValue("collaborators", values);
              }}
              renderTags={(value: string[], getTagProps) => {
                return value.map((option: any, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option.name || ""}
                    {...getTagProps({ index })}
                    style={{
                      backgroundColor: "rgb(213, 210, 202, 0.38)",
                      border: "none",
                      fontSize: "0.875rem",
                      lineHeight: "1.375rem",
                      color: "#000",
                    }}
                    deleteIcon={
                      <Close style={{ color: "#D52B1E", opacity: 0.87 }} />
                    }
                  />
                ));
              }}
              renderInput={(params) => (
                <Input
                  {...params}
                  variant="outlined"
                  id="collaboration"
                  name="collaboration"
                  label=""
                  style={{ padding: "3px" }}
                />
              )}
            />
          </FormControl>
        </FormRow>
      </>
    );
  };
  const renderNewScenarioInputs = () => {
    return (
      <>
        <FormRow>
          <SearchTool
            error={
              newScenarioFormike.touched.trialWorkspaceId &&
              Boolean(newScenarioFormike.errors.trialWorkspaceId)
            }
            helperText={
              newScenarioFormike.touched.trialWorkspaceId
                ? newScenarioFormike.errors.trialWorkspaceId
                : ""
            }
            tagSearchBarId="trialNickName"
            tagSearchBarOptions={trialWorkspaceList.map((workspace) => workspace.userTrial.trialAlias)}
            searchResultAttributes={searchResultTrialAttributes}
            fieldTitle={searchToolFieldTitle}
            searchValue={searchValue}
            onChange={handleSearchValueChange}
          />
        </FormRow>
        <FormRow>
          <FormControl component="fieldset" style={{ width: "100%" }}>
            <FormLabel component="legend">
              <FieldTitle>SCENARIO NAME*</FieldTitle>
            </FormLabel>
            <Input
              error={
                newScenarioFormike.touched.scenarioName &&
                Boolean(newScenarioFormike.errors.scenarioName)
              }
              helperText={
                newScenarioFormike.touched.scenarioName
                  ? newScenarioFormike.errors.scenarioName
                  : ""
              }
              variant="outlined"
              id="scenarioName"
              name="scenarioName"
              value={newScenarioFormike.values.scenarioName}
              onChange={newScenarioFormike.handleChange}
            />
          </FormControl>
        </FormRow>
        <FormRow>
          <FormControl component="fieldset" style={{ width: "100%" }}>
            <FormLabel component="legend">
              <FieldTitle>SCENARIO NOTES/DESCRIPTION</FieldTitle>
            </FormLabel>
            <Input
              variant="outlined"
              id="scenarioDescription"
              name="scenarioDescription"
              value={newScenarioFormike.values.scenarioDescription}
              onChange={newScenarioFormike.handleChange}
            />
          </FormControl>
        </FormRow>
      </>
    );
  };

  return (
    <Frame>
      <CustomLoading open={loading} />
      <Container>
        <BreadcrumbContainer>
          <AppBreadcrumb
            links={
              detailType === "workspace"
                ? newTrialWorkspaceBreadcrumbLinks
                : newScenarioBreadcrumbLinks
            }
          />
        </BreadcrumbContainer>
        <Title variant="h3">
          {detailType === "workspace" ? newTrialTitle : newScenarioTitle}
        </Title>
        <Description>
          {detailType === "workspace"
            ? newTrialDescription
            : newScenarioDescription}
        </Description>
        <SubmitForm
          onSubmit={
            detailType === "workspace"
              ? workspaceFormike.handleSubmit
              : newScenarioFormike.handleSubmit
          }
        >
          <ContentBox>
            {detailType === "scenario"
              ? renderNewScenarioInputs()
              : renderNewTrialWorkspaceInputs()}
          </ContentBox>
          <Grid container direction="column" alignItems="flex-end">
            <CreateButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => {
                setIsClickSubmit(true);
              }}
            >
              {detailType === "workspace"
                ? "Create Trial Workspace"
                : "Create Scenario"}
            </CreateButton>
          </Grid>
          <LowerContainer />
        </SubmitForm>
      </Container>
      <AlertDialog
        title={openDialog.title}
        content={openDialog.content}
        open={openDialog.isOpen}
        handleClose={() => {
          setOpenDialog({ ...openDialog, isOpen: false });
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(systemError)}
        onClose={handleCloseErrorTip}
        autoHideDuration={6000}
      >
        <Alert onClose={handleCloseErrorTip} severity="error">
          {systemError}
        </Alert>
      </Snackbar>
    </Frame>
  );
};

const MoleculeList = styled(Autocomplete)({
  "& .MuiFormControl-marginNormal": {
    marginTop: "0",
    marginBottom: "0",
    "& .MuiAutocomplete-input": {
      fontSize: "0.8rem",
    }
  },
});
const RowDivider = styled(Grid)({
  marginBottom: "2.5rem",
  marginTop: "5rem"
});
const Container = styled(Grid)({
  height: "500px",
  maxWidth: "65rem",
  margin: "auto",
  padding: "0 1rem",
});
const Frame = styled("div")({
  minHeight: "800px",
  width: "100%",
});
const Title = styled(Typography)({
  fontSize: "1.5rem",
  color: "#2D2D2D",
  lineHeight: "2rem",
  letterSpacing: 0,
});
const Description = styled(Typography)({
  marginTop: "20px",
  fontSize: "1rem",
  color: "#2D2D2D",
  letterSpacing: 0,
  lineHeight: "1.5rem",
});
const SubmitForm = styled("form")({
  marginTop: "20px",
});
const ContentBox = styled(Grid)({
  marginBottom: "30px",
  "& .MuiStep-horizontal": {
    padding: 0,
  },
  "& .MuiStepLabel-root": {
    minWidth: "110px",
    "&.step-0 .MuiStepLabel-labelContainer": {
      marginLeft: "30%",
    },
  },
});
const FieldTitle = styled(Typography)({
  color: "#666",
  fontSize: "0.625rem",
  fontWeight: 500,
  letterSpacing: "0.094rem",
  lineHeight: "1rem",
  textTransform: "uppercase",
  padding: "0.5rem 0rem",
});


// const Months = styled(OutlinedInput)(({ theme }) => ({
//   width: "100%",
//   "& > label": {
//     fontStyle: "italic",
//   },
//   "& > .MuiInput-underline:before": {
//     borderColor: "white !important",
//   },
//   "& .MuiFormHelperText-contained": {
//     marginLeft: 0,
//   },
//   "& .MuiInputBase-input": {
//     fontSize: "0.875rem",
//   }
// }));

const Input = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& > label": {
    fontStyle: "italic",
  },
  "& > .MuiInput-underline:before": {
    borderColor: "white !important",
  },
  "& .MuiFormHelperText-contained": {
    marginLeft: 0,
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  borderRadius: "3rem",
  marginLeft: "27.5%",
  marginTop: "2rem",
  padding: "4px 42px",
  fontSize: "1rem",
  fontWeight: 500,
}));
const LowerContainer = styled(Grid)({
  paddingBottom: "2rem",
});
const BreadcrumbContainer = styled(Grid)({
  marginBottom: "2.125rem",
  marginTop: "3.25rem",
});
const FormRow = styled(Grid)({
  // marginTop: "2.5rem",
  marginBottom: "2.5rem",
  '&& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
    padding: "3px",
  },
});
const WarningMessage = styled("p")({
  color: "orange",
  fontSize: "0.75rem",
  marginTop: "3px",
});
export default NewTrialDetail;
