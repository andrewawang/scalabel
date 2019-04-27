package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"os"
	"reflect"
	"testing"
)

func TestMainStructs(t *testing.T) {
	appmessage := reflect.TypeOf(Configuration{})
	mhost, _ := appmessage.FieldByName("MachineHost")
	if mhost.Tag != `yaml:"machineHost"` {
		t.Error("Incorrect Machine Host")
	}
	mport, _ := appmessage.FieldByName("MachinePort")
	if mport.Tag != `yaml:"machinePort"` {
		t.Error("Incorrect Machine Port")
	}
	port, _ := appmessage.FieldByName("Port")
	if port.Tag != `yaml:"port"` {
		t.Error("Incorrect Port")
	}
}

func TestInit(t *testing.T) {


	//Read from log-from stackoverflow.
	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer func() {
		log.SetOutput(os.Stderr)
	}()

	Init(ioutil.Discard, os.Stdout, os.Stdout, os.Stderr)

	//t.Log(buf.String())


	// Check flags were triggered
	if buf.String()[20:] == "Must include --config flag with path to config.yml\n" {
		t.Errorf("Fatal error occured, no path to config.yml")
	}

	//t.Log(buf.String())
}
