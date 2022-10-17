import { Button, Input, InputLabel } from "@material-ui/core";
import React, { useState } from "react";
import { QueryByStringWithClient } from "../../api/apollo";
import { graphqlStringMap } from "../../api/fetchByTypes";
// import { useFetchHelloWorld } from "../../hooks/useFetchHelloWorld";
import SeperateTable from "../../components/CustomSeperateTable";
import { GridTable } from "../../components/CustomSeperateTable/GridTable";
import { getDownloadFileFromBase64Data } from "../../utils/getDataUtil";

const Portal: React.FC = () => {
  const [scenarioId, setScenarioId] = useState("");
  const leftColumns = [
    {
      width: "13rem",
      label: "my selection",
    },
    {
      width: "",
      label: "appears in similar trials?",
    },
  ];
  const rightColumns = [
    {
      width: "11rem",
      label: "How often does activity occur in similar trials",
    },
    {
      width: "",
      label: "My Selected Visits",
    },
    {
      width: "",
      label: "My Visit Frequency",
    },
    {
      width: "",
      label: "Visit frequency in similar trials",
    },
  ];
  const leftData: any[] = [
    ["selection1,23 testfro long name and height as new selection1,23 testfro long name and height as new ", "yes"],
    ["selection2", "yes"],
    ["selection3", "yes"],
  ];
  const rightData: any[] = [
    [
      { val: "10" },
      { val: "100" },
      { val: "100" },
      { val: "100" },
    ],
    [
      { val: "11" },
      { val: "100" },
      { val: "100" },
      { val: "100" },
    ],
    [
      { val: "12" },
      { val: "100" },
      { val: "100" },
      { val: "100" },
    ]
  ];
  const getDownloadSoA = (scenarioId: string) => {
    if (scenarioId) {
      QueryByStringWithClient(graphqlStringMap.fetchExportSoA, { id: scenarioId })
        .then((res: any) => {
          if (res.data.exportSoa) {
            const { base64data, contentType, filename } = res.data.exportSoa;
            getDownloadFileFromBase64Data(base64data, contentType, filename);
          }
        });
    }
  }
  const columns = {
		left: [
			{
				title: "my selection",
				scale: 4
			},
			{
				title: "APPEARS IN SIMILAR TRIALS?",
				scale: 8
			},
		],
		right: [
			{
				title: "HOW OFTEN DOES ACTIVITY OCCUR IN SIMILAR TRIALS",
				scale: 3
			},
			{
				title: "MY SELECTED VISITS",
				scale: 3
			},{
				title: "MY VISIT FREQUENCY",
				scale: 3
			},{
				title: "VISIT FREQUENCY IN SIMILAR TRIALS",
				scale: 3
			},
		]
	};
	const data = [
		{
			left: [
				"selection1,23 testfro long name and height as new selection1,23 testfro long name and height as new",
				"yes",
			],
			right: ["10", "100", "100", "100"]
		},
		{
			left: [
				"selection2",
				"yes",
			],
			right: ["10", "100", "100", "100"]
		},
		{
			left: [
				"selection3",
				"yes",
			],
			right: ["10", "100", "100", "100"]
		}
	]
  return (
    <>
      <Input 
        placeholder="please input a scenario id." 
        onBlur={(e: any) => {
          const value = e.target.value;
          setScenarioId(value);
        }}
        startAdornment={
          <InputLabel style={{ width: '200px' }}>Secenario Id:</InputLabel>
        }
        endAdornment={
          <Button
            variant="text"
            color="primary"
            style={{ width: "200px" }}
            onClick={() => getDownloadSoA(scenarioId)}>
              Download SoA
          </Button>
        }
      />
      <SeperateTable
        tableId={"test-table"}
        title="SeperateTable"
        leftColumns={leftColumns}
        leftData={leftData}
        rightColumns={rightColumns}
        rightData={rightData}
        // leftWidth="840px"
      />
      <h1>Grid Table</h1>
      <GridTable columns={columns} data={data} style={{ width: "1300px", marginLeft: "50px" }}/>
      <div style={{ width: "100%", height: "300px"}}></div>
    </>
  );
};
export default Portal;
