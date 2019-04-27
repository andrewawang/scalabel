package main

import (
	"testing"
)

func TestHubStructs(t *testing.T) {

}

func TestNewhub(t *testing.T) {
	configuration := new(Configuration)
	hub := newhub(configuration)

	//test hub is initialized correctly
	if hub.config != configuration {
		t.Errorf("Config was modified during newhub")
	}

	if len(hub.sessions) != 0 {
		t.Error("Sessions is not empty")
	}

	if len(hub.registerSession) != 0 {
		t.Error("registerSession Channel is not empty")
	}

	if len(hub.unregisterSession) != 0 {
		t.Error("unregisterSession Channel is not empty")
	}
}
