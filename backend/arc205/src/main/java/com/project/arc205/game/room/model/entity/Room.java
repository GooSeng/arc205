package com.project.arc205.game.room.model.entity;

import com.project.arc205.game.gamecharacter.model.entity.Player;
import com.project.arc205.game.gamedata.model.entity.GameSetting;
import com.project.arc205.game.room.model.exception.PlayerIdAlreadyExistException;
import com.project.arc205.game.room.model.exception.RoomIsFullException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode(of = "id")
@ToString(of = {"id", "title", "master"})
public class Room {

    private UUID id;
    private String title;
    private Player master;
    private Map<String, Player> players;    //key: sessionId, value: Player
    private GameSetting gameSetting;

    private boolean isPlaying;

    public static Room create(String title, Player master) {
        Room room = new Room();
        room.id = UUID.randomUUID();
        room.title = title;
//        room.master = master;
//        players.put(master.getSessionId(), master);
        room.players = new HashMap<>();
//        master.setRoom(room);
        room.gameSetting = new GameSetting();
        room.isPlaying = false;
        return room;
    }

    public void enter(Player player) {
        if (this.players.containsValue(player)) {
            throw new PlayerIdAlreadyExistException(player.getId());
        }
        if (isFull()) {
            throw new RoomIsFullException(this.getId().toString());
        }
        this.players.put(player.getSessionId(), player);
        player.setRoom(this); // 양방향 매핑이므로 player에도 room을 추가함
    }

    public void remove(Player player) {
        this.players.remove(player.getSessionId());
    }

    public void setPlay() {
        this.isPlaying = true;
    }

    public boolean isFull() {
        return this.players.size() >= gameSetting.getMaxPlayers();
    }

    public void setGameSetting(GameSetting gameSetting) {
        this.gameSetting = gameSetting;
    }
}
