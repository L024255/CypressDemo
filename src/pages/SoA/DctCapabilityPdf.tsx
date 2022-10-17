import React from "react";
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';
import { SoaVisitModal } from "./type/SoaVisit";
import { DisplayDctCapability } from "./type/DctCapability";

export interface PdfProps {
  visitDctCapabilities: SoaVisitModal[];
  dctCapabilityDic: DisplayDctCapability[];
  trialCapabilities: [];
}
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: "uppercase",
    marginTop: "140px",
  },
  view: {
    height: "350px",
    backgroundColor: "#F8F8F9",
    border: "1px solid #ddd",
    borderRadius: "20px",
    padding: "10px 15px",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontWeight: "bold",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    // textAlign: "center",
    textTransform: "uppercase",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  list: {
    width: "300px",
    margin: "20px auto",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
  },
  column1: {
    marginRight: "15px",
    display: "flex",
  },
  column2: {
    display: "flex",
    marginRight: "15px",
    alignItems: "center",
  },
  dot: {
    width: "15px",
    height: "15px",
    borderRadius: 10,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: "3px",
    color: "white"
  },
});
const DctCapabilityPdf: React.FC<PdfProps> = ({
  visitDctCapabilities,
  dctCapabilityDic,
  trialCapabilities
}) => (
  <Document>
    <Page style={styles.body} orientation="landscape" wrap>
      <View style={styles.view}>
        <Text style={styles.header}>Dct Capability Summary</Text>
        <View style={styles.row}>
          {visitDctCapabilities?.map((soaVisit, index) => (
            <Text style={{ width: "50px", fontSize: 8 }} key={soaVisit.soaVisitId}>{soaVisit.soaVisit.alias || `Visit ${index + 1}`}</Text>
          ))}
        </View>
        <View style={styles.row}>
          {visitDctCapabilities?.map((soaVisit) => (
            <Text style={{ width: "50px", fontSize: 8, padding: "0 5px" }}>
              {soaVisit.hasClinic ? (
                <Image style={{ width: "15px", height: "15px", marginRight: "5px" }} src="clinicalPlus.png" />
              ) : (
                <View style={{ width: "15px", height: "15px", marginRight: "5px" }}></View>
              )}
            </Text>
          ))}
        </View>
        {dctCapabilityDic.map((dctcapability, index) => (
          <View style={[styles.row, { padding: "3px 0" }]} key={index}>
            {visitDctCapabilities?.map((soaVisit) => {
              const index = soaVisit.dctCapabilitiesSummary?.findIndex((summary) => summary.dctCapabilityId === dctcapability.id);
              const trialCap = trialCapabilities.find((capabilityId) => capabilityId === dctcapability.id);
              let customLineStyle: any = {
                backgroundColor: dctcapability.color,
                marginLeft: "5px",
                marginRight: "30px"
              };

              if (trialCap && (index === -1 || index === undefined)) {
                return (
                  <Text style={[
                    styles.dot,
                    customLineStyle
                  ]}>
                    <View style={{ color: dctcapability.color }}>R</View>
                  </Text>
                )
              }

              if (index > -1) {
                const dctCapabilitiy = soaVisit.dctCapabilitiesSummary[index];

                if (trialCap && !dctCapabilitiy.statusArray.find((cap) => cap === 'Ready Now')) {
                  dctCapabilitiy.statusArray.push('Ready Now');
                }

                return (

                  dctCapabilitiy.statusArray?.map((status: string, statusIndex: number) => {
                    if (dctCapabilitiy.statusArray.length > 1) {
                        customLineStyle = {
                          backgroundColor: dctcapability.color,
                          marginLeft: statusIndex === 0 ? "5px" : "-5px",
                          marginRight: statusIndex === 0 ? "0" : "20px",

                        };
                    }
                    if (status !== "Pilot") {
                      return (
                        <Text style={[
                          styles.dot,
                          customLineStyle
                        ]}>
                          <View style={{ color: dctcapability.color }}>R</View>
                        </Text>
                      )
                    } else {
                      customLineStyle.fontWeight="bold";
                      return (
                        <Text style={[
                          styles.dot,
                          customLineStyle
                        ]}>
                          <View>P</View>
                        </Text>
                      )
                    }
                  })

                )

              }
              return (
                <Text style={[
                  styles.dot,
                  {
                    backgroundColor: "transparent",
                    marginRight: "5px",
                    marginLeft: "30px",
                    opacity: 0,
                  }
                ]}>
                  <View style={{ color: dctcapability.color }}>R</View>
                </Text>
              )
            })}
          </View>
        ))
        }
      </View>
      <Text style={styles.title}>
        Summary Key
      </Text>
      <View style={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center", flexDirection: "row", marginTop: "20px" }}>
        <Image style={{ width: "15px", height: "15px", marginRight: "5px" }} src="clinicalPlus.png" />
        <Text style={{ width: "40px", fontSize: 10, textAlign: "center", textAnchor: "middle" }}>
          Clinic
        </Text>
      </View>
      <View style={styles.list}>
        <View style={styles.row}>
          <Text style={[styles.column1, { textTransform: "uppercase", fontSize: 8, opacity: .8 }]}>Ready</Text>
          <Text style={[styles.column2, { textTransform: "uppercase", fontSize: 8, opacity: .8 }]}>Pilot</Text>
        </View>
        {dctCapabilityDic.map((dctcapability, index) => (
          <View style={styles.row} key={index}>
            <Text style={[
              styles.dot,
              styles.column2,
              {
                backgroundColor: dctcapability.color,
                marginRight: "25px",
                marginLeft: "5px",
              }
            ]}>
              <View style={{ color: dctcapability.color }}>R</View>
            </Text>
            <Text style={[
              styles.dot,
              styles.column2,
              {
                backgroundColor: dctcapability.color,
                borderColor: dctcapability.color,
                marginRight: "20px",
                color: "white"
              }
            ]}>
              <View>P</View>
            </Text>
            <Text style={[{ fontSize: 10, textAlign: "center" }]}>{dctcapability.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default DctCapabilityPdf;