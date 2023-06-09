package com.project.arc205.game.gamedata.service;

import com.project.arc205.game.gamecharacter.model.entity.GameCharacter;
import com.project.arc205.game.gamecharacter.model.entity.Player;
import com.project.arc205.game.gamedata.dto.response.GameStartPersonalResponse;
import com.project.arc205.game.gamedata.dto.response.GameStartResponse;
import com.project.arc205.game.gamedata.manager.GameManager;
import com.project.arc205.game.gamedata.model.entity.GameData;
import com.project.arc205.game.gamedata.model.entity.GameSetting;
import com.project.arc205.game.gamedata.repository.GameRepository;
import com.project.arc205.game.room.model.entity.Room;
import com.project.arc205.game.room.repository.RoomRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class MafiaGameService implements GameService {

    private final RoomRepository roomRepository;
    private final GameRepository gameRepository;
    private final GameManager gameManager;

    @Override
    public GameStartResponse startGame(UUID roomId) {
        Room room = roomRepository.findById(roomId);
        room.setPlay();
        GameData gameData = gameManager.createGameDataFrom(room);
        gameRepository.save(roomId, gameData);

        log.info("create new gameData :: {}", gameData);
        return GameStartResponse.of(room.getGameSetting(), gameData.getGameCharacters());
    }

    @Override
    public List<GameStartPersonalResponse> getPersonalInfo(UUID roomId) {
        Map<String, Player> players = roomRepository.findById(roomId).getPlayers();
        Map<String, GameCharacter> gameCharacters = gameRepository.findById(roomId)
                .getGameCharacters();

        List<GameStartPersonalResponse> responses = new ArrayList<>(gameCharacters.size());
        players.forEach((sessionId, player) -> responses.add(
                GameStartPersonalResponse.of(sessionId, gameCharacters.get(player.getId())))
        );
        return responses;
    }

    @Override
    public GameSetting updateSetting(UUID roomId, GameSetting gameSetting) {
        Room room = roomRepository.findById(roomId);
        // return default
        return room.getGameSetting();
    }
}
