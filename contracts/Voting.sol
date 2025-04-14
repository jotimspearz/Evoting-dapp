// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint public candidatesCount;

    event VotedEvent(uint indexed candidateId);

    constructor() {
        candidatesCount = 0;
    }

    // Function to add a candidate
    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function for voting
    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate ID."
        );

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId);
    }
}
