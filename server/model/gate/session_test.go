package main

import (
	"reflect"
	"testing"
)

func TestSessionStructs(t *testing.T) {

	appmessage := reflect.TypeOf(AppMessage{})
	sid, _ := appmessage.FieldByName("SessionId")
	if sid.Tag != `json:"sessionId"` {
		t.Error("Incorrect SessionId")
	}
	st, _ := appmessage.FieldByName("SessionId")
	if st.Tag != `json:"startTime"` {
		t.Error("Incorrect StartTime")
	}

	sesResp := reflect.TypeOf(SessionResponse{})
	sid, _ = sesResp.FieldByName("SessionId")
	if sid.Tag != `json:"sessionId"` {
		t.Error("Incorrect SessionId")
	}
	td, _ := sesResp.FieldByName("TimingData")
	if td.Tag != `json:"timingData"` {
		t.Error("Incorrect TimingData")
	}

	msg := reflect.TypeOf(Message{})
	typ, _ := msg.FieldByName("Type")
	if typ.Tag != `json:"type"` {
		t.Error("Incorrect Message Type")
	}
	msgg, _ := msg.FieldByName("TimingData")
	if msgg.Tag != `json:"message"` {
		t.Error("Incorrect Message")
	}

	dummydata := reflect.TypeOf(DummyData{})
	msgg, _ = dummydata.FieldByName("Message")
	if msgg.Tag != `json:"message"` {
		t.Error("Incorrect Message")
	}
	st, _ = dummydata.FieldByName("StartTime")
	if st.Tag != `json:"startTime"` {
		t.Error("Incorrect Start Time")
	}
	terminate, _ := dummydata.FieldByName("TerminateSession")
	if terminate.Tag != `json:"terminateSession"` {
		t.Error("Incorrect Terminate Session")
	}

	dumResponse := reflect.TypeOf(DummyResponse{})
	emsgg, _ := dumResponse.FieldByName("EchoedMessage")
	if emsgg.Tag != `json:"echoedMessage"` {
		t.Error("Incorrect Echo Message")
	}
	msts, _ := dumResponse.FieldByName("ModelServerTimestamp")
	if msts.Tag != `json:"modelServerTimestamp"` {
		t.Error("Incorrect Model Server Time Stamp")
	}
	duration, _ := dumResponse.FieldByName("ModelServerDuration")
	if duration.Tag != `json:"modelServerDuration"` {
		t.Error("Incorrect Model Server Duration")
	}
	grpcDur, _ := dumResponse.FieldByName("GrpcDuration")
	if grpcDur.Tag != `json:"grpcDuration"` {
		t.Error("Incorrect GRPC Duration")
	}
	st, _ = dumResponse.FieldByName("StartTime")
	if st.Tag != `json:"startTime"` {
		t.Error("Incorrect Start Time")
	}


}

func TestStartSession(t *testing.T) {

}

func TestGrpcRegistration(t *testing.T) {
	sessionId := "Test Session"
	message, timestamp, msduration, grpcduration := grpcRegistration(sessionId)

	//check log for no fatal

	// verify returned results
	if message != "" {
		t.Error("Incorrect Message")
	}

	if timestamp != "" {
		t.Error("Incorrect timestamp")
	}

	if msduration != "" {
		t.Error("Incorrect Model Server Duration")
	}

	if grpcduration != "" {
		t.Error("Incorrect grpc Duration")
	}
}

func TestGrpcComputation(t *testing.T) {
	data := new(DummyData)
	message, timestamp, msduration, grpcduration := grpcComputation(data)

	if message != "" {
		t.Error("Incorrect Message")
	}

	if timestamp != "" {
		t.Error("Incorrect timestamp")
	}

	if msduration != "" {
		t.Error("Incorrect Model Server Duration")
	}

	if grpcduration != "" {
		t.Error("Incorrect grpc Duration")
	}
}