package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"os"
	"testing"
)

func TestInit(t *testing.T) {

	var buf bytes.Buffer
	log.SetOutput(&buf)
	defer func() {
		log.SetOutput(os.Stderr)
	}()

	Init(ioutil.Discard, os.Stdout, os.Stdout, os.Stderr)

	//t.Log(buf.String())

	if buf.String()[20:] == "Must include --config flag with path to config.yml\n" {
		t.Errorf("Fatal error occured, no path to config.yml")
	}

	//t.Log(buf.String())
}
