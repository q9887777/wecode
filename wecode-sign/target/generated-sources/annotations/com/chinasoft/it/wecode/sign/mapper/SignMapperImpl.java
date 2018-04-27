package com.chinasoft.it.wecode.sign.mapper;

import com.chinasoft.it.wecode.sign.domain.Sign;
import com.chinasoft.it.wecode.sign.dto.SignDto;
import com.chinasoft.it.wecode.sign.dto.SignResultDto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2018-04-17T22:23:11+0800",
    comments = "version: 1.2.0.CR1, compiler: javac, environment: Java 1.8.0_92 (Oracle Corporation)"
)
@Component
public class SignMapperImpl implements SignMapper {

    @Override
    public SignResultDto from(Sign arg0) {
        if ( arg0 == null ) {
            return null;
        }

        SignResultDto signResultDto = new SignResultDto();

        signResultDto.setUserId( arg0.getUserId() );
        signResultDto.setSignDate( arg0.getSignDate() );
        signResultDto.setBeginTime( arg0.getBeginTime() );
        signResultDto.setEndTime( arg0.getEndTime() );

        return signResultDto;
    }

    @Override
    public List<SignResultDto> toDtoList(List<Sign> arg0) {
        if ( arg0 == null ) {
            return null;
        }

        List<SignResultDto> list = new ArrayList<SignResultDto>( arg0.size() );
        for ( Sign sign : arg0 ) {
            list.add( from( sign ) );
        }

        return list;
    }

    @Override
    public Sign to(SignDto arg0) {
        if ( arg0 == null ) {
            return null;
        }

        Sign sign = new Sign();

        sign.setUserId( arg0.getUserId() );

        return sign;
    }

    @Override
    public List<Sign> toEntityList(List<SignDto> arg0) {
        if ( arg0 == null ) {
            return null;
        }

        List<Sign> list = new ArrayList<Sign>( arg0.size() );
        for ( SignDto signDto : arg0 ) {
            list.add( to( signDto ) );
        }

        return list;
    }
}